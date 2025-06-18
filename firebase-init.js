// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADoOmhZfdZJeP4S61TwsdHS7SoTbveJGY",
  authDomain: "escalar-4ebac.firebaseapp.com",
  projectId: "escalar-4ebac",
  storageBucket: "escalar-4ebac.appspot.com",
  messagingSenderId: "1013344754618",
  appId: "1:1013344754618:web:4e9ad3129581166447db83",
  measurementId: "G-5Y0VT6CJ8D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
