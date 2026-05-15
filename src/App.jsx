import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// 🔥 CONFIGURATION FIREBASE
// Remplace ces valeurs par celles de ton projet Firebase.
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function CoupleChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 📩 Chargement des messages en temps réel
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  // ✉️ Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await addDoc(collection(db, "messages"), {
      sender: "Moi ❤️",
      text: newMessage,
      createdAt: Date.now(),
    });

    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-purple-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-[320px_1fr]">
        
        {/* Sidebar */}
        <div className="bg-rose-500 text-white p-6 flex flex-col">
          <div>
            <h1 className="text-3xl font-bold">LoveChat 💌</h1>
            <p className="mt-2 text-rose-100">
              Discutez ensemble en temps réel.
            </p>
          </div>

          <div className="mt-8 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
            <h2 className="font-semibold text-lg">
              Connexion sécurisée
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white text-rose-500 flex items-center justify-center font-bold text-lg">
                ❤
              </div>

              <div>
                <p className="font-medium">Chat privé</p>
                <p className="text-sm text-rose-100">
                  Messages sauvegardés dans Firebase.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 text-sm text-rose-100">
            Hébergeable gratuitement avec Vercel ✨
          </div>
        </div>

        {/* CHAT */}
        <div className="flex flex-col h-[700px]">
          
          <div className="border-b px-6 py-4 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              Discussion privée
            </h2>

            <p className="text-sm text-gray-500">
              Les messages apparaissent instantanément.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-rose-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender.includes("Moi")
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-sm ${
                    msg.sender.includes("Moi")
                      ? "bg-rose-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm opacity-80 mb-1">
                    {msg.sender}
                  </p>

                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écris un message..."
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />

            <button
              onClick={sendMessage}git 
              className="bg-rose-500 hover:bg-rose-600 transition text-white px-6 rounded-2xl shadow-lg font-medium"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}