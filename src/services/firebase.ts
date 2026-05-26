import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 1. Firebase Config Check
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY' && 
  firebaseConfig.apiKey.trim() !== '';

let db: any = null;
let storage: any = null;
let useMock = true;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    storage = getStorage(app);
    useMock = false;
    console.log('🔥 Firebase initialized successfully!');
  } catch (error) {
    console.error('❌ Firebase initialization failed. Falling back to Mock DB.', error);
    useMock = true;
  }
} else {
  console.log('📦 Firebase credentials missing or placeholder. Running in Mock DB (localStorage) mode.');
  useMock = true;
}

// 2. Real-Time Subscribers for Mock Mode
const mockSubscribers: Record<string, Array<(data: any[]) => void>> = {};

const triggerMockUpdate = (collectionName: string) => {
  if (!mockSubscribers[collectionName]) return;
  const items = getMockCollection(collectionName);
  mockSubscribers[collectionName].forEach(cb => cb(items));
};

const getMockCollection = (collectionName: string): any[] => {
  const data = localStorage.getItem(`keepitclean_${collectionName}`);
  return data ? JSON.parse(data) : [];
};

const setMockCollection = (collectionName: string, data: any[]) => {
  localStorage.setItem(`keepitclean_${collectionName}`, JSON.stringify(data));
  triggerMockUpdate(collectionName);
};

// 3. Unified Wrappers Expose
export const dbService = {
  isMock: () => useMock,

  // Get all documents in a collection
  async getList<T>(collectionName: string): Promise<T[]> {
    if (useMock) {
      return getMockCollection(collectionName) as T[];
    } else {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
    }
  },

  // Get a single document
  async getDoc<T>(collectionName: string, docId: string): Promise<T | null> {
    if (useMock) {
      const items = getMockCollection(collectionName);
      const item = items.find(i => i.id === docId);
      return item ? (item as T) : null;
    } else {
      const docRef = doc(db, collectionName, docId);
      const snap = await getDoc(docRef);
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    }
  },

  // Set (overwrite or create specific) document
  async setDoc<T>(collectionName: string, docId: string, data: any): Promise<void> {
    if (useMock) {
      const items = getMockCollection(collectionName);
      const index = items.findIndex(i => i.id === docId);
      const updatedItem = { id: docId, ...data, updatedAt: new Date().toISOString() };
      
      if (index > -1) {
        items[index] = updatedItem;
      } else {
        items.push({ ...updatedItem, createdAt: new Date().toISOString() });
      }
      setMockCollection(collectionName, items);
    } else {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
    }
  },

  // Add a document (auto-generated ID)
  async addDoc<T>(collectionName: string, data: any): Promise<string> {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();
    
    if (useMock) {
      const items = getMockCollection(collectionName);
      const newItem = { id, ...data, createdAt: now, updatedAt: now };
      items.push(newItem);
      setMockCollection(collectionName, items);
      return id;
    } else {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, { ...data, createdAt: now, updatedAt: now });
      return docRef.id;
    }
  },

  // Update a document (merge changes)
  async updateDoc(collectionName: string, docId: string, data: any): Promise<void> {
    const now = new Date().toISOString();
    if (useMock) {
      const items = getMockCollection(collectionName);
      const index = items.findIndex(i => i.id === docId);
      if (index > -1) {
        items[index] = { ...items[index], ...data, updatedAt: now };
        setMockCollection(collectionName, items);
      }
    } else {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, { ...data, updatedAt: now });
    }
  },

  // Delete document
  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    if (useMock) {
      const items = getMockCollection(collectionName);
      const filtered = items.filter(i => i.id !== docId);
      setMockCollection(collectionName, filtered);
    } else {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    }
  },

  // Subscribe to real-time changes
  subscribe<T>(collectionName: string, callback: (data: T[]) => void): () => void {
    if (useMock) {
      if (!mockSubscribers[collectionName]) {
        mockSubscribers[collectionName] = [];
      }
      mockSubscribers[collectionName].push(callback);
      // Immediately call with current data
      callback(getMockCollection(collectionName) as T[]);

      // Return unsubscribe function
      return () => {
        mockSubscribers[collectionName] = mockSubscribers[collectionName].filter(cb => cb !== callback);
      };
    } else {
      const colRef = collection(db, collectionName);
      const q = query(colRef);
      return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(items as T[]);
      });
    }
  },

  // Upload receipt (Image)
  async uploadReceipt(file: File): Promise<string> {
    if (useMock) {
      return new Promise((resolve, reject) => {
        // If file is too large, we return a mock image to prevent filling local storage
        if (file.size > 1.5 * 1024 * 1024) {
          // Exceeds 1.5MB: use high-quality cleaning ticket sample
          resolve('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string); // base64 URL
        };
        reader.onerror = () => {
          reject(new Error('Error al leer el archivo de comprobante.'));
        };
        reader.readAsDataURL(file);
      });
    } else {
      const fileId = Math.random().toString(36).substring(2, 9);
      const fileExtension = file.name.split('.').pop();
      const storageRef = ref(storage, `receipts/${fileId}_${Date.now()}.${fileExtension}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  }
};
