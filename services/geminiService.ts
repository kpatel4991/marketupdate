
import { GoogleGenAI } from "@google/genai";
import { MarketUpdate, MarketSection } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const PROMPTS: Record<MarketSection, string> = {
  [MarketSection.SUMMARY]: "Provide a high-level summary of the current US market session. Focus on the S&P 500, Nasdaq, and Dow. Use bold for index names. Avoid economic jargon, explain the mood in plain English. No # headers.",
  [MarketSection.NEWS]: "Analyze the 3-5 most impactful US financial news events happening right now. Focus strictly on headlines affecting US equities. Explain why each matters for investors. Use bold for the event title. No # headers.",
  [MarketSection.FUTURES]: "Search for live/real-time prices for US Indices Futures: E-mini S&P 500 (ES), Nasdaq 100 (NQ), and Dow Jones (YM). List current price, dollar change, and percentage change. Note if the trend is bullish or bearish. No # headers.",
  [MarketSection.STOCKS]: "Identify the top 5 biggest gainers and top 5 biggest losers in the US stock market (NYSE/NASDAQ) today. Include company names, tickers, and a very brief reason for the move. Use bold for tickers. No # headers."
};

export const fetchMarketUpdate = async (section: MarketSection): Promise<MarketUpdate> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: PROMPTS[section],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const content = response.text || "Unable to fetch data at this time.";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = rawChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    return {
      content,
      sources,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error(`Error fetching ${section}:`, error);
    return {
      content: "Failed to load market data. Please try again later.",
      sources: [],
      timestamp: new Date().toLocaleTimeString(),
    };
  }
};
