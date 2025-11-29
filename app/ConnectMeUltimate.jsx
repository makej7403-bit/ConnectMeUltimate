import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
  query, 
  where
} from "firebase/firestore";
import { 
  MessageCircle, ThumbsUp, Share2, MoreHorizontal, Search, Bell, Menu, X, 
  Image as ImageIcon, Video, Smile, User, LogOut, Send, Home, Users, Store, 
  PlayCircle, Cpu, Moon, Sun, Globe, MapPin, Briefcase, Lock, ShieldCheck, 
  CreditCard, CheckCircle, Star, Zap, Activity, Radio, Mic, Camera, 
  Smartphone, BarChart, CloudLightning, Database, Eye, Fingerprint, 
  Gift, Heart, Infinity, Key, Layers, Music, Navigation, Power, 
  Rocket, Server, Terminal, Umbrella, Voicemail, Wifi, Youtube
} from 'lucide-react';

// --- Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyC5hFB3ICxzyMrlvtnQl-n-2Dkr2RFsmqc",
  authDomain: "fir-9b1f8.firebaseapp.com",
  projectId: "fir-9b1f8",
  storageBucket: "fir-9b1f8.firebasestorage.app",
  messagingSenderId: "539772525700",
  appId: "1:539772525700:web:25b5a686877ddbf6d176d1",
  measurementId: "G-7FWY3QB5MY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "connectme-ultimate-v2";
const ADMIN_EMAIL = "sokpahakinsaye@gmail.com";

// --- Feature Lists (Simulating 100+ Features) ---
const AI_FEATURES = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `AI Feature ${i+1}: ${['Neural Link', 'Deep Fake Detection', 'Dream Analysis', 'Emotion Synthesis', 'Holographic Projection', 'Telepathic Text', 'Quantum Encryption', 'Bio-Rhythm Sync', 'Auto-Translation', 'Voice Cloning'][i % 10]}`, isPro: true }));
const RANDOM_FEATURES = Array.from({ length: 50 }, (_, i) => ({ id: i + 50, name: `Feature ${i+1}: ${['Crypto Wallet', 'Mars Rover Control', '3D Printing Access', 'Drone Delivery', 'VR Meeting Room', 'NFT Marketplace', 'Laser Keyboard', 'Satellite Internet', 'Smart Home Hub', 'Sleep Tracker'][i % 10]}`, isPro: i > 10 }));

// --- Admin Panel Component ---
const AdminPanel = ({ onClose }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Listen for pending payment requests
    const q = query(collection(db, 'artifacts', appId, 'admin', 'payment_requests'), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const approveUser = async (req) => {
    try {
      // 1. Update user profile to Pro
      const userRef = doc(db, 'artifacts', appId, 'users', req.userId, 'profile', 'info');
      await setDoc(userRef, { isPro: true, proSince: serverTimestamp() }, { merge: true });
      
      // 2. Update request status
      await updateDoc(doc(db, 'artifacts', appId, 'admin', 'payment_requests', req.id), { status: 'approved' });
      
      alert(`User ${req.userName} Approved!`);
    } catch (err) {
      console.error(err);
      alert("Error approving user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 text-white w-full max-w-2xl rounded-xl p-6 border border-green-500 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
            <ShieldCheck /> Admin Command Center
          </h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <h3 className="font-bold mb-4">Pending Pro Approvals ({requests.length})</h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {requests.length === 0 ? <p className="text-gray-500">No pending requests.</p> : null}
          {requests.map(req => (
            <div key={req.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{req.userName}</p>
                <p className="text-sm text-gray-400">UID: {req.userId}</p>
                <p className="text-xs text-yellow-500">Claimed Paid via: {req.method}</p>
              </div>
              <button 
                onClick={() => approveUser(req)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
              >
                Confirm Payment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Pro Modal ---
const ProModal = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePaymentClaim = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'admin', 'payment_requests'), {
        userId: user.uid,
        userName: user.displayName || "Unknown",
        userEmail: user.email,
        method: "Manual Transfer (UBA/MoMo)",
        status: "pending",
        timestamp: serverTimestamp()
      });
      alert("Payment claim submitted! Please email your screenshot to sokpahakinsaye@gmail.com for instant approval.");
      onClose();
    } catch (e) {
      console.error(e);
      alert("Error submitting claim.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-blue-900 to-black text-white w-full max-w-lg rounded-2xl p-6 border-2 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        <div className="text-center mb-6">
          <div className="inline-block bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs mb-2">PREMIUM ACCESS</div>
          <h2 className="text-3xl font-bold text-yellow-400">Upgrade to ConnectMe PRO</h2>
          <p className="text-gray-300 mt-2">Unlock 100+ Advanced AI & Features</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Advanced AI (Dream Analysis, Deep Fake Check)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Verified Blue Tick Badge</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={20} />
            <span>Zero Ads & 4K Video Streaming</span>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-xl mb-6 border border-white/20">
          <h3 className="font-bold text-lg mb-2">Payment Details (Manual)</h3>
          <p className="text-sm text-gray-300 mb-1">Send <span className="text-yellow-400 font-bold">$9.80 USD</span> to:</p>
          <div className="bg-black/50 p-3 rounded mb-2">
            <p className="font-mono text-sm"><span className="text-blue-400">Bank:</span> UBA Liberia</p>
            <p className="font-mono text-lg font-bold text-white tracking-widest">530 207 100 153 94</p>
            <p className="text-xs text-gray-400">Name: Akin S. Sokpah</p>
          </div>
          <div className="bg-black/50 p-3 rounded">
            <p className="font-mono text-sm"><span className="text-orange-400">Mobile Money:</span> Lonestar/MTN</p>
            <p className="font-mono text-lg font-bold text-white tracking-widest">+231 889 183 557</p>
          </div>
        </div>

        <button 
          onClick={handlePaymentClaim}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl text-lg transition transform hover:scale-105 shadow-lg"
        >
          {loading ? "Processing..." : "I Have Sent The Money"}
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          After sending, email screenshot to: <span className="text-blue-400">sokpahakinsaye@gmail.com</span>
        </p>
        <button onClick={onClose} className="w-full text-center text-gray-500 mt-2 text-sm hover:text-white">Cancel</button>
      </div>
    </div>
  );
};

// --- Advanced AI ---
const UltimateAI = ({ onClose, isPro, onUpgrade }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "I am ConnectMe Ultimate AI. I can access 100+ simulated nodes." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', text: input }]);
    const userText = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "";
      
      if (userText.includes("created") || userText.includes("maker") || userText.includes("founder")) {
        response = "Akin S. Sokpah from Liberia created it.";
      } else if (!isPro && (userText.includes("analyze") || userText.includes("generate") || userText.includes("dream"))) {
        response = "ACCESS DENIED: This is a Pro Feature. Please upgrade to ConnectMe Pro ($9.80) to use Advanced AI Analysis.";
        // Trigger upgrade flow ideally, but we'll just message for now
      } else {
         if (userText.includes("hello")) response = "System Online. How can I assist you globally?";
         else if (userText.includes("liberia")) response = "Liberia is the heart of my creation.";
         else response = isPro 
           ? "Processing with Advanced Neural Engine... [Simulated Pro Response]" 
           : "I am running in FreeBasic mode. Upgrade to Pro for deep learning capabilities.";
      }

      setMessages(p => [...p, { role: 'ai', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-blue-500 flex flex-col z-40 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-purple-800 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Cpu className="animate-pulse text-cyan-400" /> 
          <div>
            <h3 className="font-bold text-sm">ConnectMe AI {isPro ? 'PRO' : 'LITE'}</h3>
            <p className="text-[10px] text-gray-300">Creator: Akin S. Sokpah</p>
          </div>
        </div>
        <button onClick={onClose}><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 backdrop-blur-sm">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-cyan-100 border border-gray-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-cyan-500 animate-pulse ml-2">Calculating...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={isPro ? "Ask Advanced AI..." : "Ask Basic AI..."}
          className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 rounded-full text-white"><Send size={18} /></button>
      </div>
      {!isPro && (
        <button onClick={onUpgrade} className="w-full bg-yellow-500 text-black text-xs font-bold py-1 hover:bg-yellow-400">
          UPGRADE TO UNLOCK FULL AI
        </button>
      )}
    </div>
  );
};

// --- Main App ---
export default function ConnectMeUltimate() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [darkMode, setDarkMode] = useState(true); // Default to Dark for "Pro" feel

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check if Admin
        if (u.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        }
        
        // Check if Pro
        const userRef = doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'info');
        // Simple listener for real-time status update after admin approval
        onSnapshot(userRef, (snap) => {
          if (snap.exists() && snap.data().isPro) {
            setIsPro(true);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Globe className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ConnectMe <span className="text-yellow-400">Ultimate</span></h1>
          <p className="text-gray-300 mb-8">The World's Most Advanced Social Network.</p>
          <div className="grid grid-cols-2 gap-4 mb-8 text-left text-sm text-gray-400">
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> 100+ AI Features</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> Pro Mode</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> Global Chat</div>
            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-400"/> Bank Secure</div>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5"/>
            Sign in with Google
          </button>
          <p className="mt-6 text-xs text-gray-500">Created by Akin S. Sokpah, Liberia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} font-sans overflow-x-hidden`}>
      
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 w-full z-30 ${darkMode ? 'bg-gray-900/90 border-b border-gray-800' : 'bg-white shadow-sm'} backdrop-blur-md px-4 h-16 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Globe size={20} className="text-white"/></div>
          <span className="text-xl font-bold hidden md:block">ConnectMe</span>
          {isPro && <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded font-bold">PRO</span>}
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setShowAI(!showAI)} className="p-2 rounded-full hover:bg-gray-800 relative group">
            <Cpu className={isPro ? "text-yellow-400" : "text-blue-500"} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">AI Assistant</span>
          </button>
          
          {!isPro && (
            <button 
              onClick={() => setShowProModal(true)}
              className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-1.5 rounded-full font-bold text-sm hover:scale-105 transition shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse"
            >
              Get PRO
            </button>
          )}

          <div className="relative group">
            <img src={user.photoURL} className="w-9 h-9 rounded-full border border-gray-600 cursor-pointer" />
            <div className="absolute right-0 top-10 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block overflow-hidden">
               <div className="px-4 py-2 border-b border-gray-700">
                 <p className="font-bold text-sm truncate">{user.displayName}</p>
                 <p className="text-xs text-gray-400">{isPro ? 'Premium Member' : 'Free Member'}</p>
               </div>
               {isAdmin && (
                 <button onClick={() => setShowAdminPanel(true)} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 flex items-center gap-2">
                   <ShieldCheck size={14}/> Admin Panel
                 </button>
               )}
               <button onClick={() => signOut(auth)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                 <LogOut size={14}/> Sign Out
               </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex justify-center max-w-[1600px] mx-auto">
        
        {/* --- Sidebar --- */}
        <div className="hidden lg:block w-64 p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-1">
            <button onClick={() => setActiveTab('feed')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'feed' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-gray-800'}`}>
              <Home size={20}/> <span>Feed</span>
            </button>
            <button onClick={() => setActiveTab('features')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'features' ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-gray-800'}`}>
              <Zap size={20}/> <span>100+ Features</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition">
              <Users size={20}/> <span>Friends</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition">
              <Store size={20}/> <span>Marketplace</span>
            </button>
            <div className="pt-4 mt-4 border-t border-gray-800">
              <p className="px-4 text-xs font-bold text-gray-500 mb-2">PRO FEATURES</p>
              <button onClick={() => !isPro && setShowProModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition opacity-75">
                {isPro ? <Activity size={20} className="text-green-400"/> : <Lock size={16} className="text-yellow-500"/>} <span>Analytics</span>
              </button>
              <button onClick={() => !isPro && setShowProModal(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition opacity-75">
                {isPro ? <Eye size={20} className="text-green-400"/> : <Lock size={16} className="text-yellow-500"/>} <span>Who Viewed Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="flex-1 max-w-2xl w-full p-4">
          
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <>
               <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                 {/* Stories */}
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="w-24 h-40 bg-gray-800 rounded-xl flex-shrink-0 relative overflow-hidden group cursor-pointer border border-gray-700">
                     <img src={`https://picsum.photos/100/160?random=${i}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"/>
                     <div className="absolute bottom-2 left-2 font-bold text-xs text-white shadow-black">User {i}</div>
                   </div>
                 ))}
               </div>

               <div className={`bg-gray-800/50 p-4 rounded-xl mb-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                 <div className="flex gap-3">
                   <img src={user.photoURL} className="w-10 h-10 rounded-full"/>
                   <input className="bg-transparent flex-1 outline-none text-white placeholder-gray-500" placeholder="Share your world..." />
                 </div>
                 <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
                    <div className="flex gap-4 text-gray-400">
                      <ImageIcon size={20} className="hover:text-green-400 cursor-pointer"/>
                      <Video size={20} className="hover:text-red-400 cursor-pointer"/>
                      <Smile size={20} className="hover:text-yellow-400 cursor-pointer"/>
                    </div>
                    <button className="bg-blue-600 px-6 py-1 rounded-full font-bold text-sm hover:bg-blue-500">Post</button>
                 </div>
               </div>

               {/* Dummy Feed */}
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
                   <div className="flex justify-between mb-3">
                     <div className="flex gap-3">
                       <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-10 h-10 rounded-full"/>
                       <div>
                         <h4 className="font-bold flex items-center gap-1">User {i} {isPro && i===1 && <Star size={12} className="text-yellow-500 fill-yellow-500"/>}</h4>
                         <p className="text-xs text-gray-500">2 hrs ago • Liberia</p>
                       </div>
                     </div>
                     <MoreHorizontal className="text-gray-500"/>
                   </div>
                   <p className="mb-3 text-gray-300">Just exploring the new ConnectMe Ultimate features! The AI is insane. 🇱🇷🚀</p>
                   <div className="h-64 bg-gray-900 rounded-lg mb-3 flex items-center justify-center text-gray-600">
                     [Rich Media Content]
                   </div>
                   <div className="flex justify-between text-gray-400 border-t border-gray-700 pt-3">
                     <button className="flex items-center gap-2 hover:text-blue-400"><ThumbsUp size={18}/> Like</button>
                     <button className="flex items-center gap-2 hover:text-blue-400"><MessageCircle size={18}/> Comment</button>
                     <button className="flex items-center gap-2 hover:text-blue-400"><Share2 size={18}/> Share</button>
                   </div>
                 </div>
               ))}
            </>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <GridIcon /> 100+ Advanced Features Vault
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-yellow-500 mb-3 border-b border-gray-700 pb-2">Ultimate AI Suite (PRO)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AI_FEATURES.map(feat => (
                    <div key={feat.id} className={`p-3 rounded-lg border flex flex-col items-center text-center gap-2 relative overflow-hidden ${isPro ? 'bg-blue-900/20 border-blue-500/30' : 'bg-gray-800 border-gray-700 opacity-60'}`}>
                      {!isPro && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Lock className="text-yellow-500"/></div>}
                      <BrainIcon />
                      <span className="text-xs font-bold">{feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-500 mb-3 border-b border-gray-700 pb-2">Recommended Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {RANDOM_FEATURES.map(feat => (
                    <div key={feat.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center text-center gap-2 hover:bg-gray-700 transition cursor-pointer">
                      <ToolIcon />
                      <span className="text-xs">{feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- Rightbar (Trending) --- */}
        <div className="hidden xl:block w-80 p-4 sticky top-16 h-screen">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6">
            <h3 className="font-bold mb-4 text-gray-400">Trending in Liberia</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Technology</p>
                  <p className="font-bold text-sm">#ConnectMeLaunch</p>
                </div>
                <MoreHorizontal size={16} className="text-gray-500"/>
              </div>
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs text-gray-500">Sports</p>
                   <p className="font-bold text-sm">Lone Star Victory</p>
                 </div>
                 <MoreHorizontal size={16} className="text-gray-500"/>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-4 text-center shadow-lg">
             <Star className="w-8 h-8 mx-auto mb-2 text-white" />
             <h3 className="font-bold text-white mb-1">Go Pro Today</h3>
             <p className="text-xs text-white/80 mb-3">Support Akin S. Sokpah & unlock the full power.</p>
             <button onClick={() => setShowProModal(true)} className="bg-white text-orange-700 w-full py-2 rounded-lg font-bold text-sm hover:bg-gray-100">Upgrade Now</button>
          </div>
        </div>

      </div>

      {/* --- Modals --- */}
      {showProModal && <ProModal user={user} onClose={() => setShowProModal(false)} />}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showAI && <UltimateAI onClose={() => setShowAI(false)} isPro={isPro} onUpgrade={() => {setShowAI(false); setShowProModal(true)}} />}

    </div>
  );
}

// Helper Icons for list generation
const BrainIcon = () => <Cpu size={24} className="text-cyan-400" />;
const GridIcon = () => <Layers size={24} className="text-purple-400" />;
const ToolIcon = () => <Rocket size={24} className="text-pink-400" />;
