
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Asset, ToastMessage } from './types';
import AssetCard from './components/AssetCard';
import AssetForm from './components/AssetForm';
import SelectionToolbar from './components/SelectionToolbar';
import Toast from './components/Toast';
import { Search, Plus, Package, ClipboardList, Loader2, Globe, Users, Lock, Share2, Cloud, CloudOff, Wifi, Link2 } from 'lucide-react';
import { subscribeToRoom, saveAssetToCloud, deleteAssetFromCloud } from './services/firebaseService';

const STORAGE_KEY = 'inventaris_asset_lokal_v1';
const ROOM_KEY = 'inventaris_room_id';

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [roomId, setRoomId] = useState<string>(localStorage.getItem(ROOM_KEY) || '');
  const [isOnline, setIsOnline] = useState(!!roomId);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Otomatis bergabung ke database tim jika ada ?room= di URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl) {
      setRoomId(roomFromUrl);
      setIsOnline(true);
      addToast(`Masuk ke Database Tim: ${roomFromUrl}`, 'info');
    }
  }, []);

  useEffect(() => {
    if (isOnline && roomId) {
      setIsInitialLoading(true);
      if (unsubscribeRef.current) unsubscribeRef.current();
      
      unsubscribeRef.current = subscribeToRoom(roomId, (cloudAssets) => {
        setAssets(cloudAssets);
        setIsInitialLoading(false);
      });
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setAssets(JSON.parse(saved));
        } catch (e) {
          console.error("Gagal memuat data lokal", e);
        }
      }
      setIsInitialLoading(false);
    }

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [isOnline, roomId]);

  const addToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveAsset = async (assetData: Omit<Asset, 'id' | 'createdAt'>) => {
    const id = editingAsset?.id || crypto.randomUUID();
    const createdAt = editingAsset?.createdAt || Date.now();
    const fullAsset: Asset = { ...assetData, id, createdAt };

    if (isOnline && roomId) {
      try {
        await saveAssetToCloud(roomId, fullAsset);
        addToast(editingAsset ? 'Cloud Updated' : 'Tersimpan Online');
      } catch (err) {
        addToast('Gagal Simpan Online. Cek Firebase Config.', 'error');
      }
    } else {
      const newAssets = editingAsset 
        ? assets.map(a => a.id === id ? fullAsset : a)
        : [fullAsset, ...assets];
      setAssets(newAssets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAssets));
      addToast(editingAsset ? 'Lokal Updated' : 'Tersimpan di Browser');
    }
    
    setIsFormOpen(false);
    setEditingAsset(undefined);
  };

  const handleShareRoom = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    addToast('Link Tim Disalin! Bagikan ke anggota tim Anda.');
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Header Online-First */}
      <header className={`bg-white sticky top-0 z-50 px-4 py-4 sm:px-8 border-b transition-all duration-500 ${isOnline ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl text-white shadow-lg transition-all ${isOnline ? 'bg-indigo-600 animate-pulse' : 'bg-slate-800'}`}>
                {isOnline ? <Wifi size={24} /> : <Package size={24} />}
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  ASSET MANAGER {isOnline ? 'ONLINE' : 'OFFLINE'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {isOnline ? `DATABASE TIM: ${roomId.toUpperCase()}` : 'PENYIMPANAN BROWSER LOKAL'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-2">
                   <button 
                    onClick={handleShareRoom}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-all"
                  >
                    <Link2 size={14} /> Bagikan Link Tim
                  </button>
                  <button 
                    onClick={() => { if(confirm("Keluar dari Mode Online?")) { setIsOnline(false); setRoomId(''); } }}
                    className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl"
                  >
                    <CloudOff size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { 
                    const id = prompt("Masukkan Nama Room untuk Tim (Contoh: konten-marketing):");
                    if(id) { setRoomId(id); setIsOnline(true); }
                  }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  <Globe size={14} /> Aktifkan Database Online
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
              <input 
                type="text"
                placeholder="Cari SKU, Nama Produk, atau Tagline..."
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl transition-all outline-none text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingAsset(undefined); setIsFormOpen(true); }}
              className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} /> Tambah Asset
            </button>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto p-6">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Cloud...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
              <Cloud size={32} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Belum Ada Asset</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-8 font-medium">
              Data di sini akan sinkron otomatis ke seluruh tim yang memiliki link yang sama.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <AssetCard 
                key={asset.id}
                asset={asset}
                isSelected={selectedIds.has(asset.id)}
                onToggleSelect={() => setSelectedIds(prev => {
                  const next = new Set(prev);
                  if (next.has(asset.id)) next.delete(asset.id);
                  else next.add(asset.id);
                  return next;
                })}
                onEdit={() => { setEditingAsset(asset); setIsFormOpen(true); }}
                onDelete={() => {
                  if(confirm("Hapus asset? Perubahan ini akan terupdate ke semua tim.")) {
                     if(isOnline) deleteAssetFromCloud(roomId, asset.id);
                     else {
                        const next = assets.filter(a => a.id !== asset.id);
                        setAssets(next);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                     }
                     addToast("Asset Terhapus", "info");
                  }
                }}
                onCopy={(text, label) => {
                   navigator.clipboard.writeText(text);
                   addToast(`${label} Disalin!`);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <SelectionToolbar 
        count={selectedIds.size}
        onBulkCopy={() => {
          const selected = assets.filter(a => selectedIds.has(a.id));
          const text = selected.map(a => `📌 ${a.name} (${a.sku})\n💡 ${a.tagline}\n💬 ${a.caption}\n💰 ${a.price}`).join('\n\n---\n\n');
          navigator.clipboard.writeText(text);
          addToast(`${selectedIds.size} Assets Disalin Massal!`);
          setSelectedIds(new Set());
        }}
        onClear={() => setSelectedIds(new Set())}
      />

      {isFormOpen && (
        <AssetForm 
          asset={editingAsset}
          onSave={handleSaveAsset}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast} />
        ))}
      </div>
    </div>
  );
};

export default App;
