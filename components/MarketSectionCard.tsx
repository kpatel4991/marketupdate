
import React from 'react';
import { ExternalLink, Clock, Hash, AlertCircle } from 'lucide-react';
import { MarketUpdate } from '../types.ts';

interface MarketSectionCardProps {
  id: string;
  title: string;
  data: MarketUpdate | null;
  loading: boolean;
  icon: React.ReactNode;
}

const MarketSectionCard: React.FC<MarketSectionCardProps> = ({ id, title, data, loading, icon }) => {
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-2" />;
      
      // Handle bold markdown
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={index} className="text-white font-bold bg-white/10 px-1 rounded mx-0.5">{part.slice(2, -2)}</span>;
        }
        return part;
      });

      return (
        <p key={i} className="text-slate-400 text-[14px] leading-relaxed mb-3 font-medium">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="glass rounded-3xl overflow-hidden group hover:border-brand-500/50 transition-all duration-500">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/20 rounded-xl text-brand-500">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        </div>
        <Hash className="w-4 h-4 text-slate-700" />
      </div>

      <div className="p-8 min-h-[300px] flex flex-col">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
            <div className="h-4 bg-white/5 rounded-full w-full"></div>
            <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
            <div className="pt-8 space-y-3">
              <div className="h-20 bg-white/5 rounded-2xl w-full"></div>
            </div>
          </div>
        ) : data ? (
          <>
            <div className="flex-1 overflow-auto custom-scrollbar">
              {formatContent(data.content)}
            </div>

            {data.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grounding Sources</span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                    <Clock className="w-3 h-3" />
                    {data.timestamp}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.sources.slice(0, 3).map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-brand-500/20 hover:border-brand-500/30 hover:text-brand-400 transition-all truncate max-w-[180px]"
                    >
                      <span className="truncate">{source.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4 opacity-40">
            <div className="p-4 rounded-full border border-dashed border-white/10">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Command</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketSectionCard;
