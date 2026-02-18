
import React from 'react';
import { ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { MarketUpdate } from '../types';

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
      
      // Detection for headers that usually come back as bold text at start of line
      if (trimmedLine.startsWith('**') && trimmedLine.length < 100 && (trimmedLine.endsWith('**') || trimmedLine.endsWith(':'))) {
        const cleanHeader = trimmedLine.replace(/\*\*/g, '').replace(/[:]$/, '');
        return (
          <h3 key={i} className="text-lg font-black text-indigo-600 mt-8 mb-3 first:mt-0 tracking-tight flex items-center gap-2 uppercase text-[13px]">
            <span className="h-1 w-4 bg-indigo-200 rounded-full"></span>
            {cleanHeader}
          </h3>
        );
      }
      
      if (trimmedLine === '') return <div key={i} className="h-2" />;
      
      // Process bold markers inside lines
      const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return <span key={index} className="font-extrabold text-slate-900 bg-slate-50 px-1 rounded">{boldText}</span>;
        }
        return part;
      });

      return (
        <p key={i} className="text-slate-600 text-[15px] leading-relaxed mb-4 font-medium">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <section id={id} className="relative group">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-200">
        <div className="p-8 md:p-12">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-5 bg-slate-100 rounded-full w-1/4 mb-6"></div>
              <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-50 rounded-full w-full"></div>
              <div className="h-4 bg-slate-50 rounded-full w-5/6"></div>
              <div className="h-32 bg-slate-50 rounded-[2rem] w-full mt-8"></div>
            </div>
          ) : data ? (
            <>
              <div className="max-w-none">
                {formatContent(data.content)}
              </div>

              {data.sources.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Market Sources</p>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>Updated {data.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.sources.slice(0, 4).map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all group/link"
                      >
                        <span className="truncate max-w-[140px]">{source.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-30 group-hover/link:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-6">
              <div className="p-6 bg-slate-50 rounded-full">
                <AlertCircle className="w-12 h-12 opacity-20" />
              </div>
              <p className="text-sm font-black tracking-[0.2em]">WAITING FOR START</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketSectionCard;
