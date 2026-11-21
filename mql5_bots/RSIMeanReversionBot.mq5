//+------------------------------------------------------------------+
//|                                        RSIMeanReversionBot.mq5   |
//|      AI-Based Crypto Market Prediction & Educational Assistant   |
//|               Authors: Farhan Ijaz & Zain-ul-Abideen             |
//+------------------------------------------------------------------+
#property copyright   "NeuroCrypto - Farhan Ijaz & Zain-ul-Abideen"
#property link        "https://github.com/Crypto_Market_Predictor"
#property version     "1.00"
#property description "RSI Mean-Reversion Expert Advisor for Crypto (BTC/USDT)"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>

//--- Input Parameters
input group "=== Trading Settings ==="
input double   InpLotSize            = 0.05;         // Trade Lot Size
input ulong    InpMagicNumber        = 100101;       // Unique EA Magic Number
input ulong    InpSlippage           = 15;           // Max Allowable Slippage (points)
input double   InpStopLossPoints     = 1200;         // Stop Loss in Points (0 = none)
input double   InpTakeProfitPoints   = 1800;         // Take Profit in Points (0 = none)
input bool     InpTrailingStopEnable = true;         // Enable Trailing Stop
input double   InpTrailingStopPoints = 600;          // Trailing Stop Distance (points)
input double   InpTrailingStepPoints = 150;          // Trailing Step (points)

input group "=== RSI Indicator Settings ==="
input int               InpRSI_Period      = 14;              // RSI Averaging Period
input ENUM_APPLIED_PRICE InpRSI_AppliedPrice = PRICE_CLOSE;   // Applied Price
input double            InpRSI_Oversold    = 32.0;            // Oversold Buy Threshold (< 32)
input double            InpRSI_Overbought  = 68.0;            // Overbought Sell Threshold (> 68)

input group "=== Trend & Volatility Filter ==="
input bool              InpUseEMASlowFilter= true;            // Use 200 EMA Trend Filter
input int               InpEMA_Period      = 200;             // EMA Period
input ENUM_TIMEFRAMES   InpTimeframe       = PERIOD_H1;       // Chart Timeframe (1H - 4H)

//--- Global Variables & Handles
CTrade         m_trade;
CPositionInfo  m_position;
int            m_rsi_handle;
int            m_ema_handle;
datetime       m_last_bar_time;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   // Configure Trade object
   m_trade.SetExpertMagicNumber(InpMagicNumber);
   m_trade.SetDeviationInPoints(InpSlippage);
   m_trade.SetTypeFilling(ORDER_FILLING_IOC);

   // Initialize RSI Handle
   m_rsi_handle = iRSI(_Symbol, InpTimeframe, InpRSI_Period, InpRSI_AppliedPrice);
   if(m_rsi_handle == INVALID_HANDLE)
   {
      PrintFormat("[-] Error creating RSI handle for %s. Error: %d", _Symbol, GetLastError());
      return(INIT_FAILED);
   }

   // Initialize EMA Handle
   if(InpUseEMASlowFilter)
   {
      m_ema_handle = iMA(_Symbol, InpTimeframe, InpEMA_Period, 0, MODE_EMA, PRICE_CLOSE);
      if(m_ema_handle == INVALID_HANDLE)
      {
         PrintFormat("[-] Error creating EMA handle for %s. Error: %d", _Symbol, GetLastError());
         return(INIT_FAILED);
      }
   }

   m_last_bar_time = 0;
   PrintFormat("[+] RSI Mean-Reversion Bot successfully initialized on %s [%s]", _Symbol, EnumToString(InpTimeframe));
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(m_rsi_handle != INVALID_HANDLE) IndicatorRelease(m_rsi_handle);
   if(m_ema_handle != INVALID_HANDLE) IndicatorRelease(m_ema_handle);
   PrintFormat("[*] RSI Mean-Reversion Bot stopped. Reason: %d", reason);
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   // Manage Trailing Stop on every tick for open positions
   if(InpTrailingStopEnable)
      ApplyTrailingStop();

   // Execute entry logic on completed bar to prevent indicator repainting
   datetime current_bar_time = iTime(_Symbol, InpTimeframe, 0);
   if(current_bar_time == m_last_bar_time)
      return;

   m_last_bar_time = current_bar_time;

   // Read RSI Values [Index 1 = Previous closed candle, Index 2 = Candle before]
   double rsi_buffer[2];
   if(CopyBuffer(m_rsi_handle, 0, 1, 2, rsi_buffer) < 2)
   {
      Print("[-] Failed to copy RSI buffer.");
      return;
   }
   double current_rsi = rsi_buffer[1];
   double previous_rsi = rsi_buffer[0];

   // Read EMA Values if filter enabled
   double ema_val = 0;
   if(InpUseEMASlowFilter)
   {
      double ema_buffer[1];
      if(CopyBuffer(m_ema_handle, 0, 1, 1, ema_buffer) < 1)
      {
         Print("[-] Failed to copy EMA buffer.");
         return;
      }
      ema_val = ema_buffer[0];
   }

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   int open_buys = 0;
   int open_sells = 0;
   CountPositions(open_buys, open_sells);

   // Determine Trend Bias
   bool bullish_trend = !InpUseEMASlowFilter || (tick.ask > ema_val);
   bool bearish_trend = !InpUseEMASlowFilter || (tick.bid < ema_val);

   // Buy Signal: RSI crossed upward out of oversold (< 32)
   if(previous_rsi <= InpRSI_Oversold && current_rsi > InpRSI_Oversold && bullish_trend)
   {
      // Close opposing sells if any
      if(open_sells > 0)
         ClosePositions(POSITION_TYPE_SELL);

      if(open_buys == 0)
      {
         double sl = (InpStopLossPoints > 0) ? (tick.ask - InpStopLossPoints * _Point) : 0;
         double tp = (InpTakeProfitPoints > 0) ? (tick.ask + InpTakeProfitPoints * _Point) : 0;
         m_trade.Buy(InpLotSize, _Symbol, tick.ask, sl, tp, "RSI Dip Buy [Mean Reversion]");
         PrintFormat("[+] Opened BUY on %s at %f | RSI was: %.2f", _Symbol, tick.ask, current_rsi);
      }
   }

   // Sell / Short Signal: RSI crossed downward out of overbought (> 68)
   else if(previous_rsi >= InpRSI_Overbought && current_rsi < InpRSI_Overbought && bearish_trend)
   {
      // Close opposing buys if any
      if(open_buys > 0)
         ClosePositions(POSITION_TYPE_BUY);

      if(open_sells == 0)
      {
         double sl = (InpStopLossPoints > 0) ? (tick.bid + InpStopLossPoints * _Point) : 0;
         double tp = (InpTakeProfitPoints > 0) ? (tick.bid - InpTakeProfitPoints * _Point) : 0;
         m_trade.Sell(InpLotSize, _Symbol, tick.bid, sl, tp, "RSI Top Sell [Mean Reversion]");
         PrintFormat("[+] Opened SELL on %s at %f | RSI was: %.2f", _Symbol, tick.bid, current_rsi);
      }
   }
}

//+------------------------------------------------------------------+
//| Count active positions owned by this EA                          |
//+------------------------------------------------------------------+
void CountPositions(int &buys, int &sells)
{
   buys = 0;
   sells = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i))
      {
         if(m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
         {
            if(m_position.PositionType() == POSITION_TYPE_BUY)  buys++;
            if(m_position.PositionType() == POSITION_TYPE_SELL) sells++;
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Close positions by type                                          |
//+------------------------------------------------------------------+
void ClosePositions(ENUM_POSITION_TYPE pos_type)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i))
      {
         if(m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
         {
            if(m_position.PositionType() == pos_type)
               m_trade.PositionClose(m_position.Ticket());
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Trailing Stop Logic                                              |
//+------------------------------------------------------------------+
void ApplyTrailingStop()
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i))
      {
         if(m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
         {
            ulong ticket = m_position.Ticket();
            double open_price = m_position.PriceOpen();
            double current_sl = m_position.StopLoss();
            double current_tp = m_position.TakeProfit();

            if(m_position.PositionType() == POSITION_TYPE_BUY)
            {
               double new_sl = tick.bid - InpTrailingStopPoints * _Point;
               if(tick.bid - open_price > InpTrailingStopPoints * _Point)
               {
                  if(new_sl > current_sl + InpTrailingStepPoints * _Point)
                     m_trade.PositionModify(ticket, new_sl, current_tp);
               }
            }
            else if(m_position.PositionType() == POSITION_TYPE_SELL)
            {
               double new_sl = tick.ask + InpTrailingStopPoints * _Point;
               if(open_price - tick.ask > InpTrailingStopPoints * _Point)
               {
                  if(current_sl == 0 || new_sl < current_sl - InpTrailingStepPoints * _Point)
                     m_trade.PositionModify(ticket, new_sl, current_tp);
               }
            }
         }
      }
   }
}
//+------------------------------------------------------------------+
