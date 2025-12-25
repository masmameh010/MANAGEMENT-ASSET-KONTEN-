
import React from 'react';
import { Asset } from '../types';
import { Copy, Edit3, Trash2, Tag, Check, Layout, MessageSquare, Image as ImageIcon, DollarSign, Package, Hash } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: (text: string, label: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  isSelected, 
  onToggleSelect, 
  onEdit, 
  onDelete, 
  onCopy 
}) => {
  const FieldRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="group relative bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all duration-200">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <Icon size={12} className="text-indigo-400" />
          {label}
        </div>
        <button 
          onClick={() => onCopy(value, label)}
          className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-90"
          title={`Salin ${label}`}
        >
          <Copy size={14} />
        </button>
      </div>
      <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed font-semibold whitespace-pre-wrap">
        {value || '-'}
      </p>
    </div>
  );

  return (
    <div className={`group relative bg-white rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden ${
      isSelected 
        ? 'border-indigo-500 ring-8 ring-indigo-500/5 shadow-2xl scale-[1.02]' 
        : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:border-slate-300'
    }`}>
      {/* Visual Area */}
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        {asset.imageUrl ? (
          <img 
            src={asset.imageUrl} 
            alt={asset.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3 bg-gradient-to-br from-slate-50 to-slate-100">
            <ImageIcon size={40} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">No Image</span>
          </div>
        )}
        
        {/* Selection */}
        <button 
          onClick={onToggleSelect}
          className={`absolute top-5 left-5 w-9 h-9 rounded-xl flex items-center justify-center border-2 backdrop-blur-md transition-all active:scale-90 z-20 ${
            isSelected 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
              : 'bg-white/60 border-white text-transparent'
          }`}
        >
          {isSelected && <Check size={20} strokeWidth={4} />}
        </button>

        {/* Floating Category */}
        <div className="absolute bottom-4 left-5 z-10">
          <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg">
            {asset.category}
          </span>
        </div>

        {/* Quick Edit/Delete */}
        <div className="absolute top-5 right-5 flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 z-20">
          <button onClick={onEdit} className="w-10 h-10 bg-white/90 backdrop-blur hover:bg-white text-slate-700 rounded-xl shadow-lg flex items-center justify-center active:scale-90 border border-slate-100">
            <Edit3 size={18} />
          </button>
          <button onClick={onDelete} className="w-10 h-10 bg-white/90 backdrop-blur hover:bg-rose-50 text-rose-500 rounded-xl shadow-lg flex items-center justify-center active:scale-90 border border-slate-100">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-7">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {asset.sku && (
                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  #{asset.sku}
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 line-clamp-1 tracking-tight">{asset.name}</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <FieldRow icon={Tag} label="Tagline" value={asset.tagline} />
          <FieldRow icon={MessageSquare} label="Caption" value={asset.caption} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Harga</span>
                <button onClick={() => onCopy(asset.price, "Harga")} className="text-emerald-300 hover:text-emerald-700">
                  <Copy size={12} />
                </button>
              </div>
              <p className="text-base font-black text-emerald-700 truncate">{asset.price || 'TBA'}</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
               <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Info</span>
                <button onClick={() => onCopy(asset.productInfo, "Info Produk")} className="text-slate-300 hover:text-slate-600">
                  <Copy size={12} />
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-600 line-clamp-1 italic">{asset.productInfo || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
