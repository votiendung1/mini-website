import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Lấy config từ Firebase Console
// Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: "AIzaSyB9GSr5u3Z3fsRa9PJECPpWlOyWjGvXPLc",
  authDomain: "mini-website-builder.firebaseapp.com",
  projectId: "mini-website-builder",
  storageBucket: "mini-website-builder.firebasestorage.app",
  messagingSenderId: "502596976085",
  appId: "1:502596976085:web:dc10e223d89f782e9ad15c",
  measurementId: "G-VTGN75N5G9"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
export { doc, getDoc };