
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { Asset } from "../types";

/**
 * LANGKAH PENTING:
 * Ganti isi objek di bawah ini dengan konfigurasi dari Firebase Console Anda
 * agar data tersimpan di akun Cloud Anda sendiri.
 */
const firebaseConfig = {
  apiKey: "SALIN_API_KEY_ANDA_DI_SINI",
  authDomain: "project-anda.firebaseapp.com",
  projectId: "project-anda",
  storageBucket: "project-anda.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Aktifkan cache lokal agar jika internet mati sebentar, data tetap bisa dibaca
try {
  enableIndexedDbPersistence(db).catch((err) => {
      console.warn("Persistence status:", err.code);
  });
} catch (e) {}

export const subscribeToRoom = (roomId: string, callback: (assets: Asset[]) => void) => {
  const roomName = roomId.trim().toLowerCase() || "umum";
  // Mengambil data dari koleksi cloud berdasarkan nama room
  const q = query(
    collection(db, "rooms", roomName, "assets"), 
    orderBy("createdAt", "desc")
  );
  
  // onSnapshot akan mendeteksi SETIAP kali ada perubahan data oleh siapa pun di tim
  return onSnapshot(q, (snapshot) => {
    const assets: Asset[] = [];
    snapshot.forEach((doc) => {
      assets.push({ ...doc.data(), id: doc.id } as Asset);
    });
    callback(assets);
  }, (error) => {
    console.error("Gagal sinkronisasi online:", error);
  });
};

export const saveAssetToCloud = async (roomId: string, asset: Asset) => {
  const roomName = roomId.trim().toLowerCase() || "umum";
  const docRef = doc(db, "rooms", roomName, "assets", asset.id);
  const { id, ...dataToSave } = asset;
  await setDoc(docRef, dataToSave, { merge: true });
};

export const deleteAssetFromCloud = async (roomId: string, assetId: string) => {
  const roomName = roomId.trim().toLowerCase() || "umum";
  const docRef = doc(db, "rooms", roomName, "assets", assetId);
  await deleteDoc(docRef);
};
