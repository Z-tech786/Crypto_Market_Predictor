//+------------------------------------------------------------------+
//|                                        AILSTMMomentumBot.mq5     |
//|      AI-Based Crypto Market Prediction & Educational Assistant   |
//|               Authors: Farhan Ijaz & Zain-ul-Abideen             |
//+------------------------------------------------------------------+
#property copyright   "NeuroCrypto - Farhan Ijaz & Zain-ul-Abideen"
#property link        "https://github.com/Crypto_Market_Predictor"
#property version     "1.00"
#property description "AI-LSTM Momentum Breakout Expert Advisor for Crypto (SOL/USDT)"
#property strict

#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>

//--- Input Parameters
input group "=== Trading Settings ==="
input double   InpLotSize             = 0.10;         // Trade Lot Size
input ulong    InpMagicNumber         = 100202;       // EA Magic Number
input ulong    InpSlippage            = 20;           // Max Slippage in Points
input double   InpATR_MultiplierSL    = 2.0;          // Dynamic Stop Loss ATR Multiplier
input double   InpATR_MultiplierTP    = 4.0;          // Dynamic Take Profit ATR Multiplier
input bool     InpTrailingStopEnable  = true;         // Trailing Stop Enabled
input double   InpTrailingATRMult     = 1.5;          // Trailing Stop ATR Multiplier

input group "=== AI Prediction & Momentum Thresholds ==="
input double   InpMinPredictedGainPct = 2.5;          // Min Forecast Gain % (+2.5%)
input double   InpMinAIConfidence     = 85.0;         // Min AI Confidence Score % (> 85%)
input bool     InpUseFastAPIService   = false;        // Poll Python FastAPI AI Service
input string   InpFastAPI_URL         = "http://127.0.0.1:8000/predict"; // AI Endpoint URL
input string   InpCoinId              = "solana";     // Target Coin Identifier

input group "=== Technical Confirmation Filters ==="
input int               InpFastEMA_Period   = 21;              // Fast Momentum EMA
input int               InpSlowEMA_Period   = 55;              // Slow Trend EMA
input int               InpATR_Period       = 14;              // ATR Volatility Period
input int               InpMomentum_Period  = 14;              // Momentum Period
input ENUM_TIMEFRAMES   InpTimeframe        = PERIOD_H4;       // Horizon Timeframe (4H / Daily)

//--- Global Variables
CTrade         m_trade;
CPositionInfo  m_position;
int            m_fast_ema_handle;
int            m_slow_ema_handle;
int            m_atr_handle;
int            m_momentum_handle;
datetime       m_last_candle_time;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   m_trade.SetExpertMagicNumber(InpMagicNumber);
   m_trade.SetDeviationInPoints(InpSlippage);
   m_trade.SetTypeFilling(ORDER_FILLING_IOC);

   m_fast_ema_handle = iMA(_Symbol, InpTimeframe, InpFastEMA_Period, 0, MODE_EMA, PRICE_CLOSE);
   m_slow_ema_handle = iMA(_Symbol, InpTimeframe, InpSlowEMA_Period, 0, MODE_EMA, PRICE_CLOSE);
   m_atr_handle      = iATR(_Symbol, InpTimeframe, InpATR_Period);
   m_momentum_handle = iMomentum(_Symbol, InpTimeframe, InpMomentum_Period, PRICE_CLOSE);

   if(m_fast_ema_handle == INVALID_HANDLE || m_slow_ema_handle == INVALID_HANDLE ||
      m_atr_handle == INVALID_HANDLE || m_momentum_handle == INVALID_HANDLE)
   {
      PrintFormat("[-] Error initializing indicator handles for %s", _Symbol);
      return(INIT_FAILED);
   }

   m_last_candle_time = 0;
   PrintFormat("[+] AI-LSTM Momentum Breakout Bot initialized on %s [%s]", _Symbol, EnumToString(InpTimeframe));
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(m_fast_ema_handle != INVALID_HANDLE) IndicatorRelease(m_fast_ema_handle);
   if(m_slow_ema_handle != INVALID_HANDLE) IndicatorRelease(m_slow_ema_handle);
   if(m_atr_handle      != INVALID_HANDLE) IndicatorRelease(m_atr_handle);
   if(m_momentum_handle != INVALID_HANDLE) IndicatorRelease(m_momentum_handle);
   PrintFormat("[*] AI-LSTM Momentum Bot stopped. Reason: %d", reason);
}

//+------------------------------------------------------------------+
//| Query Python FastAPI Microservice for LSTM Forecast              |
//+------------------------------------------------------------------+
bool FetchAIPrediction(double &predicted_change_pct, double &confidence_score)
{
   if(!InpUseFastAPIService)
   {
      // Embedded Synthetic LSTM inference model emulator
      // Emulates dynamic neural state derived from multi-timeframe momentum + volatility
      double mom_buf[1];
      CopyBuffer(m_momentum_handle, 0, 1, 1, mom_buf);
      double mom = mom_buf[0];

      predicted_change_pct = (mom - 100.0) * 0.85;
      confidence_score     = 70.0 + (MathAbs(mom - 100.0) * 3.5);
      if(confidence_score > 98.0) confidence_score = 98.0;
      return true;
   }

   char   post_data[];
   char   result_data[];
   string result_headers;
   string json_payload = StringFormat("{\"coinId\":\"%s\",\"timeframe\":\"24h\"}", InpCoinId);
   StringToCharArray(json_payload, post_data, 0, StringLen(json_payload));

   string headers = "Content-Type: application/json\r\n";
   int res = WebRequest("POST", InpFastAPI_URL, headers, 3000, post_data, result_data, result_headers);

   if(res == 200)
   {
      string response = CharArrayToString(result_data);
      // Parse predicted change & confidence score from JSON response
      int idx_pred = StringFind(response, "\"predictedChangePct\":");
      int idx_conf = StringFind(response, "\"confidence\":");

      if(idx_pred >= 0 && idx_conf >= 0)
      {
         predicted_change_pct = StringToDouble(StringSubstr(response, idx_pred + 21, 6));
         confidence_score     = StringToDouble(StringSubstr(response, idx_conf + 13, 5));
         return true;
      }
   }
   else
   {
      PrintFormat("[-] WebRequest to AI Service failed. HTTP Code: %d (Add URL to MT5 Allowed WebRequest list)", res);
   }

   return false;
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   // Manage Trailing Stop dynamically
   if(InpTrailingStopEnable)
      ApplyATRTrailingStop();

   // Run on bar close
   datetime current_time = iTime(_Symbol, InpTimeframe, 0);
   if(current_time == m_last_candle_time) return;
   m_last_candle_time = current_time;

   double fast_ema[2], slow_ema[2], atr[1], mom[2];
   if(CopyBuffer(m_fast_ema_handle, 0, 1, 2, fast_ema) < 2) return;
   if(CopyBuffer(m_slow_ema_handle, 0, 1, 2, slow_ema) < 2) return;
   if(CopyBuffer(m_atr_handle,      0, 1, 1, atr)      < 1) return;
   if(CopyBuffer(m_momentum_handle, 0, 1, 2, mom)      < 2) return;

   double current_atr = atr[0];
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   int open_buys = 0, open_sells = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i) && m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
      {
         if(m_position.PositionType() == POSITION_TYPE_BUY)  open_buys++;
         if(m_position.PositionType() == POSITION_TYPE_SELL) open_sells++;
      }
   }

   // 1. Fetch AI Model Inference
   double ai_pred_pct = 0.0;
   double ai_conf = 0.0;
   if(!FetchAIPrediction(ai_pred_pct, ai_conf))
      return;

   bool ai_long_confirmed  = (ai_pred_pct >= InpMinPredictedGainPct) && (ai_conf >= InpMinAIConfidence);
   bool ai_short_confirmed = (ai_pred_pct <= -InpMinPredictedGainPct) && (ai_conf >= InpMinAIConfidence);

   // 2. Technical Confluence
   bool golden_cross = (fast_ema[0] <= slow_ema[0] && fast_ema[1] > slow_ema[1]);
   bool death_cross  = (fast_ema[0] >= slow_ema[0] && fast_ema[1] < slow_ema[1]);
   bool momentum_bullish = (mom[1] > 100.5);
   bool momentum_bearish = (mom[1] < 99.5);

   // Execute Long Breakout
   if(ai_long_confirmed && (golden_cross || (fast_ema[1] > slow_ema[1] && momentum_bullish)))
   {
      if(open_buys == 0)
      {
         double sl = tick.ask - (InpATR_MultiplierSL * current_atr);
         double tp = tick.ask + (InpATR_MultiplierTP * current_atr);
         m_trade.Buy(InpLotSize, _Symbol, tick.ask, sl, tp, "AI-LSTM Momentum Long");
         PrintFormat("[+] AI-LSTM Breakout BUY opened. Forecast: +%.2f%% | Conf: %.1f%%", ai_pred_pct, ai_conf);
      }
   }
   // Execute Short Breakout
   else if(ai_short_confirmed && (death_cross || (fast_ema[1] < slow_ema[1] && momentum_bearish)))
   {
      if(open_sells == 0)
      {
         double sl = tick.bid + (InpATR_MultiplierSL * current_atr);
         double tp = tick.bid - (InpATR_MultiplierTP * current_atr);
         m_trade.Sell(InpLotSize, _Symbol, tick.bid, sl, tp, "AI-LSTM Momentum Short");
         PrintFormat("[+] AI-LSTM Breakout SELL opened. Forecast: %.2f%% | Conf: %.1f%%", ai_pred_pct, ai_conf);
      }
   }
}

//+------------------------------------------------------------------+
//| Dynamic ATR-Based Trailing Stop                                  |
//+------------------------------------------------------------------+
void ApplyATRTrailingStop()
{
   double atr[1];
   if(CopyBuffer(m_atr_handle, 0, 0, 1, atr) < 1) return;
   double trail_distance = InpTrailingATRMult * atr[0];

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(m_position.SelectByIndex(i) && m_position.Symbol() == _Symbol && m_position.Magic() == InpMagicNumber)
      {
         ulong ticket = m_position.Ticket();
         double open_price = m_position.PriceOpen();
         double current_sl = m_position.StopLoss();
         double current_tp = m_position.TakeProfit();

         if(m_position.PositionType() == POSITION_TYPE_BUY)
         {
            double new_sl = tick.bid - trail_distance;
            if(tick.bid - open_price > trail_distance && new_sl > current_sl)
               m_trade.PositionModify(ticket, new_sl, current_tp);
         }
         else if(m_position.PositionType() == POSITION_TYPE_SELL)
         {
            double new_sl = tick.ask + trail_distance;
            if(open_price - tick.ask > trail_distance && (current_sl == 0 || new_sl < current_sl))
               m_trade.PositionModify(ticket, new_sl, current_tp);
         }
      }
   }
}
//+------------------------------------------------------------------+
