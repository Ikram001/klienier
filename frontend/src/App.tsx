import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Copy, Check, LinkIcon, Download, BarChart3, 
  Home, Menu, X, ExternalLink, MousePointerClick 
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

// --- Interfaces ---

interface Visit {
  timestamp: number;
}

interface AnalyticsData {
  totalClicks: number;
  redirectURL: string;
  visitHistory: Visit[];
}

// --- Shared Components ---

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  const menuItems = [
    { name: 'Shortener', path: '/', icon: Home },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={toggle} />
      )}
      
      <aside className={`fixed top-0 right-0 h-full w-72 bg-[#0d0d0d] border-l border-white/10 z-50 transition-transform duration-500 ease-in-out transform 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group" onClick={toggle}>
            <img 
              src="./src/assets/favicon.png" 
              alt="Logo" 
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="font-bold text-lg tracking-tighter">KLIENIER</span>
          </Link>
          <button onClick={toggle} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={toggle}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
                location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-lg">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 px-8 w-full text-center">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Version</p>
                <p className="text-sm text-indigo-400">1.0.4-Stable</p>
            </div>
        </div>
      </aside>
    </>
  );
};

// --- Page: URL Shortener ---

const ShortenerPage = () => {
  const [url, setUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullShortUrl = `https://klienier-backend.vercel.app/url/${shortId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const response = await axios.post('https://klienier-backend.vercel.app/url', { url });
      setShortId(response.data.id);
    } catch (_err) { 
      alert(`Error generating URL${_err}`); 
    } finally { 
      setLoading(false); 
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg') as SVGSVGElement | null;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${shortId}.png`;
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-700">
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">
          Shorten. Share. <span className="text-indigo-500">Track.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
          A minimal, fast, and open-source URL shortener for the modern web.
        </p>
      </header>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-3 shadow-2xl transition-all hover:border-white/20">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="url"
            placeholder="Paste your long link here..."
            className="flex-1 bg-transparent px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-lg outline-none placeholder:text-gray-600"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button disabled={loading} size="lg" className="bg-white text-black font-bold px-8 py-7 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all duration-300 disabled:opacity-50">
            {loading ? 'Processing...' : 'Shorten Now'}
          </Button>
        </form>
      </div>

      {shortId && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-between">
            <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <LinkIcon size={14}/> Generated Link
            </span>
            <div className="flex items-center justify-between gap-4 mt-4">
              <code className="text-xl md:text-2xl font-mono text-indigo-300 truncate">
                {fullShortUrl.replace('https://', '')}
              </code>
              <Button 
                onClick={() => { navigator.clipboard.writeText(fullShortUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                variant="secondary" size="icon" className="rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 text-white border-none"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative group">
            <div className="bg-white p-2 rounded-xl">
              <QRCodeSVG id="qr-code-svg" value={fullShortUrl} size={80} level="H" />
            </div>
            <button onClick={downloadQRCode} className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
              <Download size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page: Analytics ---

const AnalyticsPage = () => {
  const [searchId, setSearchId] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://klienier-backend.vercel.app/url/analytics/${searchId}`);
      setData(res.data);
    } catch (_err) { 
      alert(`Could not find ID ${_err}`); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in duration-700">
      <header className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-4">
          <BarChart3 className="text-indigo-500" size={48} /> Insights
        </h2>
        <p className="text-gray-400 text-lg">Enter your short ID to see performance metrics.</p>
      </header>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-3 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
          <input 
            placeholder="Enter Short ID (e.g. 8f2k9l)"
            className="flex-1 bg-transparent px-6 py-4 outline-none placeholder:text-gray-600 text-lg"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <Button 
            onClick={fetchAnalytics} 
            disabled={loading} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-500">
          <div className="bg-linear-to-br from-indigo-600/20 to-transparent border border-indigo-500/20 p-10 rounded-3xl backdrop-blur-sm">
            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <MousePointerClick size={14} /> Total Clicks
            </p>
            <h3 className="text-7xl font-black">{data.totalClicks || 0}</h3>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-3xl flex flex-col justify-center backdrop-blur-sm">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ExternalLink size={14}/> Destination
            </p>
            <p className="text-xl font-medium truncate text-gray-300">
              {data.redirectURL || "Source not found"}
            </p>
          </div>
          
          {data.visitHistory && data.visitHistory.length > 0 && (
            <div className="md:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl">
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-6">Recent Activity</p>
              <div className="space-y-4">
                {data.visitHistory.slice(-3).reverse().map((visit, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0">
                    <span className="text-gray-400 text-sm">Visitor detected</span>
                    <span className="text-indigo-400 font-mono text-xs">
                      {new Date(visit.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )} 
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
        <header className="fixed top-0 w-full p-6 flex items-center justify-between z-40 bg-[#0a0a0a]/40 backdrop-blur-xl border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="./src/assets/favicon.png" alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-bold text-xl tracking-tighter">KLIENIER</span>
          </Link>

          <button 
            onClick={() => setSidebarOpen(true)} 
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all"
          >
            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Menu</span>
            <Menu size={20} className="text-indigo-500" />
          </button>
        </header>

        <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[140px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full"></div>
        </div>

        <main className="pt-32 px-6 pb-20">
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}