import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Copy, Check, LinkIcon, Download } from "lucide-react"
import { QRCodeSVG } from 'qrcode.react'; // Import the QR component

function App() {
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
    } catch (err) {
      console.error("Error shortening URL", err);
      alert("Failed to shorten URL. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Optional: Function to download the QR code as an image
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${shortId}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-linear-to-b from-white to-white/50">
            Shorten. Share. <span className="text-indigo-500">Track.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
            A minimal, fast, and open-source URL shortener for the modern web.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-2 md:p-3 shadow-2xl transition-all hover:border-white/20">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="url"
              placeholder="Paste your long link here..."
              className="flex-1 bg-transparent px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-lg outline-none placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <Button
              disabled={loading}
              size="lg"
              className="bg-white text-black font-bold px-8 py-7 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all duration-300 disabled:opacity-50 border-none shadow-none"
            >
              {loading ? 'Processing...' : 'Shorten Now'}
            </Button>
          </form>
        </div>

        {shortId && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="md:col-span-2 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-between">
              <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <LinkIcon size={14} /> Generated Link
              </span>
              <div className="flex items-center justify-between gap-4">
                <code className="text-xl md:text-2xl font-mono text-indigo-300 truncate">
                  {fullShortUrl.replace('https://', '')}
                </code>
                <Button 
                  onClick={copyToClipboard}
                  variant="secondary"
                  size="icon"
                  className="rounded-xl bg-indigo-500/20 hover:bg-indigo-500/40 text-white border-none"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>
            
            {/* Live QR Code Section */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative group">
              <span className="text-gray-500 text-xs mb-3 font-bold uppercase tracking-tighter">Scan to Visit</span>
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={fullShortUrl} 
                  size={80} 
                  level="H" 
                  includeMargin={false}
                />
              </div>
              <button 
                onClick={downloadQRCode}
                className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                title="Download QR"
              >
                <Download size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;