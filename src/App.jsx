import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import "./index.css";

// 🔥 CONFIGURATION FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBqLnbumaxTWzIpwLmpGNFOS46OWuQ2f_c",
  authDomain: "messager-private.firebaseapp.com",
  projectId: "messager-private",
  storageBucket: "messager-private.firebasestorage.app",
  messagingSenderId: "82744627532",
  appId: "1:82744627532:web:3cd51591eb90e3db03ffe9",
  measurementId: "G-CR2B03YSBX",
};

// 🔥 Initialisation Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export default function CoupleChatApp() {
  // STATES
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [user, setUser] = useState(null);

  // 🔑 CONNEXION GOOGLE
  const login = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error(error);
  }
};

  // 🚪 DÉCONNEXION
  const logout = async () => {
    await signOut(auth);

    setUser(null);
  };

  // 📩 RÉCUPÉRATION DES MESSAGES
  useEffect(() => {

  // 🔑 Récupération après redirection Google
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        setUser(result.user);

        console.log("Utilisateur connecté :", result.user.displayName);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // 📩 Chargement des messages
  const q = query(
    collection(db, "messages"),
    orderBy("createdAt")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages(data);
  });

  return () => unsubscribe();

}, []);

  // ✉️ ENVOYER MESSAGE
  const sendMessage = async () => {
    if (!user) {
      alert("Connecte-toi d'abord");
      return;
    }

    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        sender: user.displayName,
        photo: user.photoURL,
        text: newMessage,
        createdAt: Date.now(),
      });

      setNewMessage("");

      console.log("Message envoyé");
    } catch (error) {
      console.error("Erreur Firebase :", error);
    }
  };

  return (
    <>
      {/* HEADER CONNEXION */}
      <div className="w-full bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-rose-500">
          LoveChat 💌
        </h1>

        {!user ? (
          <button
            onClick={login}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Connexion Google
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="profil"
                className="w-10 h-10 rounded-full"
              />

              <p className="font-medium">
                {user.displayName}
              </p>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* PAGE */}
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-purple-200 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-[320px_1fr]">

          {/* SIDEBAR */}
          <div className="bg-rose-500 text-white p-6 flex flex-col">
            <div>
              <h2 className="text-3xl font-bold">
                LoveChat 💌
              </h2>

              <p className="mt-2 text-rose-100">
                Discutez ensemble en temps réel.
              </p>
            </div>

            <div className="mt-8 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <h2 className="font-semibold text-lg">
                Chat sécurisé
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white text-rose-500 flex items-center justify-center font-bold text-lg">
                  ❤
                </div>

                <div>
                  <p className="font-medium">
                    Firebase connecté
                  </p>

                  <p className="text-sm text-rose-100">
                    Messages sauvegardés en temps réel.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 text-sm text-rose-100">
              Hébergé avec Vercel ✨
            </div>
          </div>

          {/* CHAT */}
          <div className="flex flex-col h-[700px]">

            {/* TOP */}
            <div className="border-b px-6 py-4 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">
                Discussion privée
              </h2>

              <p className="text-sm text-gray-500">
                Messages synchronisés instantanément.
              </p>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-rose-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    user &&
                    msg.sender === user.displayName
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                      user &&
                      msg.sender === user.displayName
                        ? "bg-rose-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {msg.photo && (
                        <img
                          src={msg.photo}
                          alt="profil"
                          className="w-8 h-8 rounded-full"
                        />
                      )}

                      <p className="text-sm font-medium">
                        {msg.sender}
                      </p>
                    </div>

                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="p-4 border-t bg-white flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(e.target.value)
                }
                placeholder="Écris un message..."
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />

              <button
                onClick={sendMessage}
                className="bg-rose-500 hover:bg-rose-600 transition text-white px-6 rounded-2xl shadow-lg font-medium"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}