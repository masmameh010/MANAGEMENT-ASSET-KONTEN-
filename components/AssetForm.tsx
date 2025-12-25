
import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
// Added Package to the list of icons imported from lucide-react
import { X, Sparkles, Save, Link as LinkIcon, Loader2, Image as ImageIcon, Hash, DollarSign, Type, Package } from 'lucide-react';
import { generateMarketingContent } from '../services/geminiService';

interface AssetFormProps {
  asset?: Asset;
  onSave: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ asset, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Asset, 'id' | 'createdAt'>>({
    sku: '',
    name: '',
    imageUrl: '',
    prompt: '',
    tagline: '',
    productInfo: '',
    caption: '',
    price: '',
    category: 'Umum'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        sku: asset.sku || '',
        name: asset.name,
        imageUrl: asset.imageUrl || '',
        prompt: asset.prompt,
        tagline: asset.tagline,
        productInfo: asset.productInfo,
        caption: asset.caption,
        price: asset.price,
        category: asset.category
      });
    }
  }, [asset]);

  const handleAiGenerate = async () => {
    if (!formData.productInfo.trim()) {
      alert('Masukkan deskripsi singkat di "Informasi Produk" agar AI punya referensi.');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateMarketingContent(formData.productInfo);
      setFormData(prev => ({
        ...prev,
        tagline: result.tagline || prev.tagline,
        caption: result.caption || prev.caption,
        prompt: result.prompt || prev.prompt,
        price: prev.price || result.harga_saran
      }));
    } catch (error) {
      alert('AI sedang sibuk, silakan coba lagi atau isi manual.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-[2rem] shadow-2xl flex flex-col animate-fade-in overflow-hidden">
        
        {/* Header - Sticky */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {asset ? '📝 Edit Data Asset' : '✨ Tambah Data Asset'}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Database Konten Lokal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            
            {/* Kolom Kiri: Identitas Produk */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="text-indigo-600" size={18} />
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Identitas Produk</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">ID / SKU</label>
                    <input 
                      type="text"
                      placeholder="EX: MN-01"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold"
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Nama Produk *</label>
                    <input 
                      required
                      type="text"
                      placeholder="Nama produk..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Harga</label>
                    <input 
                      type="text"
                      placeholder="Rp 0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Kategori</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Kuliner</option>
                      <option>Fashion</option>
                      <option>Elektronik</option>
                      <option>Jasa</option>
                      <option>Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Link Gambar Produk</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="url"
                        placeholder="https://link-foto.com/image.jpg"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs"
                        value={formData.imageUrl}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Type className="text-indigo-600" size={18} />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Informasi Produk</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                    BANTU DENGAN AI
                  </button>
                </div>
                <textarea 
                  rows={4}
                  placeholder="Ketik deskripsi produk untuk rujukan..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm resize-none"
                  value={formData.productInfo}
                  onChange={e => setFormData({...formData, productInfo: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* Kolom Kanan: Aset Konten */}
            <div className="space-y-6">
              <div className="bg-indigo-900 p-6 rounded-3xl shadow-xl shadow-indigo-100 space-y-6">
                <div className="flex items-center gap-2 text-white/50">
                  <ImageIcon size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest">Aset Konten Marketing</h3>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase mb-1.5 ml-1 tracking-widest">Tagline Kreatif</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Sensasi Kopi Lokal di Setiap Tegukan"
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:bg-white/20 outline-none text-sm text-white font-medium placeholder:text-white/20 transition-all"
                    value={formData.tagline}
                    onChange={e => setFormData({...formData, tagline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase mb-1.5 ml-1 tracking-widest">Prompt Visual AI (DALL-E/Midjourney)</label>
                  <textarea 
                    rows={3}
                    placeholder="Deskripsi untuk membuat gambar produk via AI..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:bg-white/20 outline-none text-sm text-white italic placeholder:text-white/20 resize-none transition-all"
                    value={formData.prompt}
                    onChange={e => setFormData({...formData, prompt: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase mb-1.5 ml-1 tracking-widest">Caption Media Sosial</label>
                  <textarea 
                    rows={8}
                    placeholder="Draft tulisan postingan Instagram/TikTok..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:bg-white/20 outline-none text-sm text-white leading-relaxed placeholder:text-white/20 resize-none transition-all"
                    value={formData.caption}
                    onChange={e => setFormData({...formData, caption: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="px-6 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-300 uppercase hidden sm:block">* Wajib diisi</p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3.5 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-2xl transition-all"
            >
              BATAL
            </button>
            <button 
              onClick={() => {
                if(!formData.name.trim()) {
                   alert("Mohon isi Nama Produk");
                   return;
                }
                onSave(formData);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              <Save size={18} />
              SIMPAN DATA ASSET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetForm;
