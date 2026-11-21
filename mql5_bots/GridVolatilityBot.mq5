//+------------------------------------------------------------------+
//|                                         GridVolatilityBot.mq5    |
//|      AI-Based Crypto Market Prediction & Educational Assistant   |
//|               Authors: Farhan Ijaz & Zain-ul-Abideen             |
//+------------------------------------------------------------------+
#property copyright   "NeuroCrypto - Farhan Ijaz & Zain-ul-Abideen"
#property link        "https://github.com/Crypto_Market_Predictor"
#property version     "1.00"
#property description "Grid Trading Range Volatility EA for Crypto (AVAX/USDT, BTC/USDT)"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\OrderInfo.mqh>

//--- Input Parameters
input group "=== Grid Range Settings ==="
input double   InpGridUpperPrice       = 72000.0;     // Channel Upper Bound (Resistance)
input double   InpGridLowerPrice       = 62000.0;     // Channel Lower Bound (Support)
input int      InpGridLevels           = 10;          // Number of Grid Intervals (Levels)
input double   InpGridLotSize          = 0.02;        // Lot Size per Grid Level
input ulong    InpMagicNumber          = 100404;      // EA Magic Number
input ulong    InpSlippage             = 20;          // Slippage Tolerance (points)

input group "=== Range Auto-Detection (Optional) ==="
input bool     InpAutoDetectRange      = false;       // Auto-detect Range via ATR & Donchian
input int      InpRangeCandleLookback  = 100;         // Lookback Candles for Channel
input ENUM_TIMEFRAMES InpTimeframe     = PERIOD_H1;   // Evaluation Timeframe

input group "=== Risk Controls ==="
input double   InpRangeBreakoutStopPts = 1500;        // Stop All if Price Breaks Out by (Points)
input bool     InpCloseOnDeinit        = false;       // Cancel Pending Grid Orders on Deinit

//--- Global Variables
CTrade         m_trade;
CPositionInfo  m_position;
COrderInfo     m_order;
double         m_grid_step;
double         m_upper_bound;
double         m_lower_bound;
datetime       m_last_check_time;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   m_trade.SetExpertMagicNumber(InpMagicNumber);
   m_trade.SetDeviationInPoints(InpSlippage);
   m_trade.SetTypeFilling(ORDER_FILLING_IOC);

   m_upper_bound = InpGridUpperPrice;
   m_lower_bound = InpGridLowerPrice;

   if(InpAutoDetectRange)
   {
      double highest = iHigh(_Symbol, InpTimeframe, iHighest(_Symbol, InpTimeframe, MODE_HIGH, InpRangeCandleLookback, 1));
      double lowest  = iLow(_Symbol,  InpTimeframe, iLowest(_Symbol,  InpTimeframe, MODE_LOW,  InpRangeCandleLookback, 1));
      if(highest > lowest)
      {
         m_upper_bound = highest;
         m_lower_bound = lowest;
      }
   }

   if(m_upper_bound <= m_lower_bound || InpGridLevels < 2)
   {
      Print("[-] Invalid Grid Parameters: Upper price must be greater than Lower price.");
      return(INIT_PARAMETERS_INCORRECT);
   }

   m_grid_step = (m_upper_bound - m_lower_bound) / InpGridLevels;
   m_last_check_time = 0;

   // Deploy Initial Grid Structure
   SetupGrid();

   PrintFormat("[+] Grid Volatility Bot initialized on %s (Range: %.2f - %.2f | Step: %.2f)",
               _Symbol, m_lower_bound, m_upper_bound, m_grid_step);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(InpCloseOnDeinit)
   {
      CancelAllGridPendingOrders();
   }
   PrintFormat("[*] Grid Volatility Bot deinitialized. Reason: %d", reason);
}

//+------------------------------------------------------------------+
//| Cancel all pending orders for this EA                            |
//+------------------------------------------------------------------+
void CancelAllGridPendingOrders()
{
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      if(m_order.SelectByIndex(i) && m_order.Symbol() == _Symbol && m_order.Magic() == InpMagicNumber)
      {
         m_trade.OrderDelete(m_order.Ticket());
      }
   }
}

//+------------------------------------------------------------------+
//| Deploy the full Grid Network of Limit Orders                     |
//+------------------------------------------------------------------+
void SetupGrid()
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   // Place buy limits below current price, and sell limits above
   for(int level = 0; level <= InpGridLevels; level++)
   {
      double target_price = NormalizeDouble(m_lower_bound + (level * m_grid_step), _Digits);

      // Level below current market: Place BUY LIMIT with Take Profit at next level up
      if(target_price < tick.bid - (10 * _Point))
      {
         if(!HasOrderOrPositionAtLevel(target_price, POSITION_TYPE_BUY))
         {
            double tp = NormalizeDouble(target_price + m_grid_step, _Digits);
            m_trade.BuyLimit(InpGridLotSize, target_price, _Symbol, 0, tp, ORDER_TIME_GTC, 0, "Grid Buy Limit");
         }
      }
      // Level above current market: Place SELL LIMIT with Take Profit at next level down
      else if(target_price > tick.ask + (10 * _Point))
      {
         if(!HasOrderOrPositionAtLevel(target_price, POSITION_TYPE_SELL))
         {
            double tp = NormalizeDouble(target_price - m_grid_step, _Digits);
            m_trade.SellLimit(InpGridLotSize, target_price, _Symbol, 0, tp, ORDER_TIME_GTC, 0, "Grid Sell Limit");
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Check if an order or open position exists at this grid level     |
//+------------------------------------------------------------------+
bool HasOrderOrPositionAtLevel(double price, ENUM_POSITION_TYPE type)
{
   double tolerance = m_grid_step * 0.35;

   // Check Pending Orders
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      if(m_order.SelectByIndex(i) && m_order.Symbol() == _Symbol && m_order.Magic() == InpMagicNumber)
      {
         if(MathAbs(m_order.PriceOpen() - price) <= tolerance)
            return true;
      }
   }

   // Check Active Positions
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i) && m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
      {
         if(m_position.PositionType() == type && MathAbs(m_position.PriceOpen() - price) <= tolerance)
            return true;
      }
   }

   return false;
}

//+------------------------------------------------------------------+
//| Replenish fulfilled grid levels after order executions           |
//+------------------------------------------------------------------+
void MaintainGrid()
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   // Breakout Protection: Check if price escaped outside defined grid bounds
   if(tick.bid > m_upper_bound + (InpRangeBreakoutStopPts * _Point) ||
      tick.ask < m_lower_bound - (InpRangeBreakoutStopPts * _Point))
   {
      PrintFormat("[!] Range Breakout detected on %s! Halting new grid orders.", _Symbol);
      return;
   }

   // Ensure every empty grid notch has its corresponding order
   for(int level = 0; level <= InpGridLevels; level++)
   {
      double target_price = NormalizeDouble(m_lower_bound + (level * m_grid_step), _Digits);

      if(target_price < tick.bid - (10 * _Point))
      {
         if(!HasOrderOrPositionAtLevel(target_price, POSITION_TYPE_BUY))
         {
            double tp = NormalizeDouble(target_price + m_grid_step, _Digits);
            m_trade.BuyLimit(InpGridLotSize, target_price, _Symbol, 0, tp, ORDER_TIME_GTC, 0, "Grid Buy Limit");
         }
      }
      else if(target_price > tick.ask + (10 * _Point))
      {
         if(!HasOrderOrPositionAtLevel(target_price, POSITION_TYPE_SELL))
         {
            double tp = NormalizeDouble(target_price - m_grid_step, _Digits);
            m_trade.SellLimit(InpGridLotSize, target_price, _Symbol, 0, tp, ORDER_TIME_GTC, 0, "Grid Sell Limit");
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   // Periodically refresh grid every 30 seconds
   datetime now = TimeCurrent();
   if(now - m_last_check_time < 30)
      return;

   m_last_check_time = now;
   MaintainGrid();
}
//+------------------------------------------------------------------+
