
import React from 'react';
import { Copy, X, Share2 } from 'lucide-react';

interface SelectionToolbarProps {
  count: number;
  onBulkCopy: () => void;
  onClear: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ count, onBulkCopy, onClear }) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 border border-slate-700">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
          <span className="bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {count}
          </span>
          <span className="text-sm font-semibold text-slate-300">Asset terpilih</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBulkCopy}
            className="flex items-center gap-2 bg-white text-slate-900 hover:bg-indigo-50 px-4 py-2 rounded-xl font-bold text-sm transition-all"
          >
            <Copy size={16} />
            Salin Massal ({count})
          </button>
          
          <button 
            onClick={onClear}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Batalkan Pilihan"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionToolbar;
