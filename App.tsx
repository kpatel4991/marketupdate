
import React, { useState, useCallback } from 'react';
import MarketSectionCard from './components/MarketSectionCard';
import { MarketSection, MarketUpdate } from './types';
import { fetchMarketUpdate } from './services/geminiService';
import { 
  LayoutDashboard, 
  Newspaper, 
  BarChart3, 
  ArrowUpRight,
  TrendingUp,
  Zap,
  RefreshCw,
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

  const startAnalysis = useCallback(async () => {
    setHasStarted(true);
    const sections = Object.values(MarketSection);
    
    sections.forEach(async (section) => {
      setLoadingStates(prev => ({ ...prev, [section]: true }));
      const update = await fetchMarketUpdate(section);
      setMarketData(prev => ({ ...prev, [section]: update }));
      setLoadingStates(prev => ({ ...prev, [section]: false }));
    });
  }, []);

  const sectionsConfig = [
    { id: MarketSection.SUMMARY, title: "US Market Pulse", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: MarketSection.NEWS, title: "Breaking US News", icon: <Newspaper className="w-5 h-5" /> },
    { id: MarketSection.FUTURES, title: "Live US Futures", icon: <BarChart3 className="w-5 h-5" /> },
    { id: MarketSection.STOCKS, title: "Top Stock Movers", icon: <ArrowUpRight className="w-5 h-5" /> },
  ];

  const isAnyLoading = Object.values(loadingStates).some(l => l);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 font-sans">
      {!hasStarted ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-blue-600 text-xs font-black shadow-sm tracking-widest">
                <Globe className="w-3.5 h-3.5" />
                US MARKETS ONLY
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
              Market <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">Insights.</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
              Real-time intelligence on US News, Stocks, and Futures. 
              Complex financial data, simplified in seconds.
            </p>

            <div className="pt-4">
              <button
                onClick={startAnalysis}
                className="group relative px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-bold text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-4 mx-auto"
              >
                Start Analysis
                <Zap className="w-6 h-6 fill-current group-hover:animate-pulse" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6 opacity-30 pt-8 grayscale">
              <span className="text-sm font-black tracking-widest">S&P 500</span>
              <span className="text-sm font-black tracking-widest">NASDAQ</span>
              <span className="text-sm font-black tracking-widest">DOW JONES</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                Live US Analytics
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Market Update</h1>
              <p className="text-slate-500 font-medium">Focused on US News, Equities, and Indices Futures.</p>
            </div>
            <button
              onClick={startAnalysis}
              disabled={isAnyLoading}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isAnyLoading ? 'animate-spin text-blue-500' : ''}`} />
              {isAnyLoading ? 'Updating...' : 'Refresh All'}
            </button>
          </header>

          <div className="space-y-12">
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
          
          <div className="mt-20 pt-10 text-center opacity-30">
            <div className="inline-flex items-center gap-2 font-black text-xs tracking-[0.3em] uppercase">
              <TrendingUp className="w-4 h-4" />
              US Market Intelligence
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
