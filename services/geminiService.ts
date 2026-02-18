
import { GoogleGenAI } from "@google/genai";
import { MarketUpdate, MarketSection } from "../types.ts";

const PROMPTS: Record<MarketSection, string> = {
  [MarketSection.SUMMARY]: "Provide a concise, high-impact summary of the current US market session. Focus on the S&P 500, Nasdaq, and Dow. Analyze the overall sentiment. Use Markdown. No # headers.",
  [MarketSection.NEWS]: "Identify the top 3 critical US financial news events from the last 12 hours. Explain the specific impact on the US market. Use Markdown. No # headers.",
  [MarketSection.FUTURES]: "Retrieve real-time data for US Indices Futures: ES (S&P 500), NQ (Nasdaq 100), and YM (Dow). Provide current price, points change, and % change. No # headers.",
  [MarketSection.STOCKS]: "List the top 3 gainers and top 3 losers in the S&P 500 today. Include tickers, price moves, and a one-sentence catalyst for each. Use Markdown. No # headers."
};

export const fetchMarketUpdate = async (section: MarketSection): Promise<MarketUpdate> => {
  // Use a new instance right before the call as per guidelines, with process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: PROMPTS[section],
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Access .text property directly (not a method).
    const content = response.text || "No data received from market analyst.";
    
    // Extract grounding chunks for citations as required by search grounding rules.
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
  } catch (error: any) {
    console.error(`Gemini Service Error (${section}):`, error);
    return {
      content: `### SERVICE_FAILURE\nFailed to reach market analyst. ${error?.message || 'Check connection.'}`,
      sources: [],
      timestamp: new Date().toLocaleTimeString(),
      error: true
    };
  }
};
