//+------------------------------------------------------------------+
//|                                         DCAAccumulatorBot.mq5    |
//|      AI-Based Crypto Market Prediction & Educational Assistant   |
//|               Authors: Farhan Ijaz & Zain-ul-Abideen             |
//+------------------------------------------------------------------+
#property copyright   "NeuroCrypto - Farhan Ijaz & Zain-ul-Abideen"
#property link        "https://github.com/Crypto_Market_Predictor"
#property version     "1.00"
#property description "Dollar Cost Averaging (DCA) Accumulator EA for Crypto (ETH/USDT)"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>

//--- Input Parameters
input group "=== DCA Core Configuration ==="
input double   InpBaseLotSize          = 0.05;         // Base Entry Lot Size
input double   InpLotMultiplier        = 1.25;         // Martingale / Step Lot Multiplier
input ulong    InpMagicNumber          = 100303;       // EA Magic Number
input ulong    InpSlippage             = 15;           // Slippage Tolerance (points)
input int      InpMaxDCAOrders         = 8;            // Maximum Concurrent DCA Orders

input group "=== Accumulation Mode & Step ==="
input bool     InpEnableTimedDCA       = true;         // Timed Interval Purchases
input int      InpIntervalHours        = 24;           // Timed Interval in Hours
input bool     InpEnableDipStepDCA     = true;         // Dip-Triggered DCA (Step Drop)
input double   InpStepDropPercent      = 2.5;          // Step Drop % to Trigger Next Purchase

input group "=== Basket Profit Target & Risk Management ==="
input double   InpBasketTakeProfitUSD  = 75.0;         // Basket Profit Target in Account Currency ($)
input double   InpBasketTakeProfitPct  = 3.5;          // Basket Target Gain % from Weighted Avg Entry
input double   InpMaxBasketLossUSD     = 500.0;        // Emergency Max Drawdown Stop ($ USD)
input bool     InpUseSafetyStop        = false;        // Enable Emergency Stop

//--- Global Variables
CTrade         m_trade;
CPositionInfo  m_position;
datetime       m_last_order_time;
double         m_last_buy_price;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   m_trade.SetExpertMagicNumber(InpMagicNumber);
   m_trade.SetDeviationInPoints(InpSlippage);
   m_trade.SetTypeFilling(ORDER_FILLING_IOC);

   m_last_order_time = 0;
   m_last_buy_price  = 0.0;

   // Inspect existing open positions
   UpdateBasketState();

   PrintFormat("[+] DCA Accumulator Bot initialized on %s (Max Orders: %d)", _Symbol, InpMaxDCAOrders);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   PrintFormat("[*] DCA Accumulator Bot stopped. Reason: %d", reason);
}

//+------------------------------------------------------------------+
//| Update basket weighted price and order counts                    |
//+------------------------------------------------------------------+
void UpdateBasketState(int &count, double &total_lots, double &avg_price, double &floating_pnl)
{
   count        = 0;
   total_lots   = 0.0;
   avg_price    = 0.0;
   floating_pnl = 0.0;
   double total_cost = 0.0;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i) && m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
      {
         if(m_position.PositionType() == POSITION_TYPE_BUY)
         {
            count++;
            double vol = m_position.Volume();
            total_lots += vol;
            total_cost += (m_position.PriceOpen() * vol);
            floating_pnl += m_position.Profit() + m_position.Swap();
            m_last_buy_price = m_position.PriceOpen();
         }
      }
   }

   if(total_lots > 0)
      avg_price = total_cost / total_lots;
}

void UpdateBasketState()
{
   int count; double lots, avg, pnl;
   UpdateBasketState(count, lots, avg, pnl);
}

//+------------------------------------------------------------------+
//| Close all basket positions                                       |
//+------------------------------------------------------------------+
void CloseAllBasket()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i) && m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
      {
         m_trade.PositionClose(m_position.Ticket());
      }
   }
   m_last_buy_price = 0.0;
   PrintFormat("[*] DCA Basket fully closed and banked profit on %s", _Symbol);
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   int    total_orders = 0;
   double total_volume = 0.0;
   double weighted_avg = 0.0;
   double basket_profit = 0.0;

   UpdateBasketState(total_orders, total_volume, weighted_avg, basket_profit);

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   // 1. Check Take Profit Thresholds
   if(total_orders > 0)
   {
      // Target A: Fixed Dollar profit reached
      bool profit_usd_met = (basket_profit >= InpBasketTakeProfitUSD);

      // Target B: Weighted average percentage gain reached
      double gain_pct = ((tick.bid - weighted_avg) / weighted_avg) * 100.0;
      bool profit_pct_met = (gain_pct >= InpBasketTakeProfitPct);

      if(profit_usd_met || profit_pct_met)
      {
         PrintFormat("[$$$] DCA Basket Profit Target reached! Floating Profit: $%.2f (Gain: %.2f%%). Closing basket.", basket_profit, gain_pct);
         CloseAllBasket();
         return;
      }

      // Check Emergency Stop Loss
      if(InpUseSafetyStop && basket_profit <= -InpMaxBasketLossUSD)
      {
         PrintFormat("[!] Emergency stop triggered for DCA Basket! Loss: $%.2f", basket_profit);
         CloseAllBasket();
         return;
      }
   }

   // 2. Initial Base Order Entry (when zero open orders)
   if(total_orders == 0)
   {
      m_trade.Buy(InpBaseLotSize, _Symbol, tick.ask, 0, 0, "DCA Accumulator - Initial Order");
      m_last_order_time = TimeCurrent();
      m_last_buy_price  = tick.ask;
      PrintFormat("[+] DCA Initial Base BUY placed at %f (Lots: %.2f)", tick.ask, InpBaseLotSize);
      return;
   }

   // 3. Subsequent DCA Orders Logic
   if(total_orders < InpMaxDCAOrders)
   {
      bool should_buy = false;
      string reason = "";

      // Condition A: Dip-Triggered Step Drop
      if(InpEnableDipStepDCA && m_last_buy_price > 0)
      {
         double price_drop_pct = ((m_last_buy_price - tick.ask) / m_last_buy_price) * 100.0;
         if(price_drop_pct >= InpStepDropPercent)
         {
            should_buy = true;
            reason = StringFormat("Dip Step -%.2f%% Drop", price_drop_pct);
         }
      }

      // Condition B: Periodic Timed Accumulation
      if(!should_buy && InpEnableTimedDCA)
      {
         datetime time_elapsed = TimeCurrent() - m_last_order_time;
         if(time_elapsed >= (datetime)(InpIntervalHours * 3600))
         {
            should_buy = true;
            reason = StringFormat("Timed Interval %d Hours Reached", InpIntervalHours);
         }
      }

      if(should_buy)
      {
         // Calculate progressive lot size based on multiplier
         double next_lot = InpBaseLotSize * MathPow(InpLotMultiplier, total_orders);
         next_lot = NormalizeDouble(next_lot, 2);

         m_trade.Buy(next_lot, _Symbol, tick.ask, 0, 0, StringFormat("DCA Order #%d (%s)", total_orders + 1, reason));
         m_last_order_time = TimeCurrent();
         m_last_buy_price  = tick.ask;
         PrintFormat("[+] DCA Order #%d Executed (%s) at %f (Lots: %.2f)", total_orders + 1, reason, tick.ask, next_lot);
      }
   }
}
//+------------------------------------------------------------------+
