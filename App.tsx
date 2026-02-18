
import React, { useState, useCallback, useEffect } from 'react';
import MarketSectionCard from './components/MarketSectionCard.tsx';
import { MarketSection, MarketUpdate } from './types.ts';
import { fetchMarketUpdate } from './services/geminiService.ts';
import { 
  Activity, 
  Newspaper, 
  LineChart, 
  ArrowUpRight,
  RefreshCw,
  Terminal,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Globe
} from 'lucide-react';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [marketData, setMarketData] = useState<Record<MarketSection, MarketUpdate | null>>({
    [MarketSection.SUMMARY]: null,
    [MarketSection.NEWS]: null,
    [MarketSection.FUTURES]: null,
    [MarketSection.STOCKS]: null,
  });
  const [loadingStates, setLoadingStates] = useState<Record<MarketSection, boolean>>({
    [MarketSection.SUMMARY]: false,
    [MarketSection.NEWS]: false,
    [MarketSection.FUTURES]: false,
    [MarketSection.STOCKS]: false,
  });

  const runAnalysis = useCallback(async () => {
    setHasStarted(true);
    const sections = Object.values(MarketSection);
    
    sections.forEach(async (section) => {
      setLoadingStates(prev => ({ ...prev, [section]: true }));
      const update = await fetchMarketUpdate(section);
      setMarketData(prev => ({ ...prev, [section]: update }));
      setLoadingStates(prev => ({ ...prev, [section]: false }));
    });
  }, []);

  const isAnyLoading = Object.values(loadingStates).some(l => l);
  // Fix: Explicitly cast the value to MarketUpdate | null to resolve the 'unknown' property error when using Object.values on a Record.
  const hasKeyError = Object.values(marketData).some(data => (data as MarketUpdate | null)?.error);

  const sectionsConfig = [
    { id: MarketSection.SUMMARY, title: "Market Sentiment", icon: <Activity className="w-5 h-5" /> },
    { id: MarketSection.NEWS, title: "Breaking Headlines", icon: <Newspaper className="w-5 h-5" /> },
    { id: MarketSection.FUTURES, title: "Indices Futures", icon: <LineChart className="w-5 h-5" /> },
    { id: MarketSection.STOCKS, title: "Movers & Shakers", icon: <ArrowUpRight className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-brand-500 selection:text-white">
      {!hasStarted ? (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full"></div>
          
          <div className="z-10 max-w-4xl w-full text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-500 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">
              <Globe className="w-3 h-3" />
              Real-time US Data Feed
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.85] text-white">
              Financial <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500">Intelligence.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Analyze the latest financial news, events, and their impact on the US market using the world's most advanced AI models.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={runAnalysis}
                className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-white/10"
              >
                Launch Terminal
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-6 px-6 py-5 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>S&P 500</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>NASDAQ</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>VIX</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-12">
          {hasKeyError && (
            <div className="mb-10 p-5 glass rounded-2xl border-red-500/30 bg-red-500/5 flex items-center gap-4 text-red-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div className="text-sm font-medium">
                <b>Configuration Warning:</b> API Key is missing in Vercel. Go to Settings > Environment Variables, add <code>API_KEY</code>, and redeploy.
              </div>
            </div>
          )}

          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-600 rounded-lg">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <span className="text-brand-500 font-black text-xs uppercase tracking-widest">Active Analysis Session</span>
              </div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight">Market Pulse</h1>
              <p className="text-slate-400 font-medium max-w-md">Real-time aggregate of US market indices, news, and volatility indicators.</p>
            </div>
            
            <button
              onClick={runAnalysis}
              disabled={isAnyLoading}
              className="flex items-center gap-3 px-6 py-4 glass hover:bg-white/10 rounded-xl font-bold text-white transition-all disabled:opacity-50 group"
            >
              <RefreshCw className={`w-5 h-5 text-brand-500 ${isAnyLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              {isAnyLoading ? 'Processing Data...' : 'Refresh All Channels'}
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectionsConfig.map((section) => (
              <MarketSectionCard
                key={section.id}
                id={section.id}
                title={section.title}
                icon={section.icon}
                data={marketData[section.id as MarketSection]}
                loading={loadingStates[section.id as MarketSection]}
              />
            ))}
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase">
              <TrendingUp className="w-4 h-4" />
              Institutional Grade AI Analytics
            </div>
            <div className="text-[10px] font-mono">
              SYSTEM_STATUS: NOMINAL // US_FED_PROB: 0.25
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
