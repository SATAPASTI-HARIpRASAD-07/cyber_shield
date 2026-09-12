import React, { useState } from 'react';
import { QrCode, Upload, Camera, ShieldAlert } from 'lucide-react';
import { analyzeInput } from '../services/api';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

export const QrScanner: React.FC = () => {
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (contentToScan?: string) => {
    const target = contentToScan || qrInput;
    if (!target.trim()) return;

    setLoading(true);
    try {
      const res = await analyzeInput('qr', target.trim());
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate QR image decoding
      const simulatedUrl = 'http://192.168.1.45/upi-pay-get-free-cashback-1000';
      setQrInput(simulatedUrl);
      handleScan(simulatedUrl);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">QR Code Security Shield</h1>
          <p className="text-xs text-slate-400">
            Decodes and verifies QR code destinations before your camera app opens them.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A: Image Upload */}
        <div className="glass-panel p-6 text-center space-y-3 border border-purple-500/30">
          <Upload className="w-8 h-8 text-purple-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Upload QR Image</h3>
          <p className="text-xs text-slate-400">Upload a screenshot or photo of any QR code</p>
          <label className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-all">
            Choose QR Image
            <input type="file" accept="image/*" onChange={handleSimulateQrUpload} className="hidden" />
          </label>
        </div>

        {/* Option B: Manual Input / Decoded Text */}
        <div className="glass-panel p-6 space-y-3 border border-slate-800">
          <Camera className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200 text-center">Decoded QR Content</h3>
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Paste decoded QR link or UPI URI..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
          />
          <button
            onClick={() => handleScan()}
            disabled={loading || !qrInput.trim()}
            className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl disabled:opacity-50"
          >
            {loading ? 'Analyzing QR Destination...' : 'Analyze QR Payload'}
          </button>
        </div>
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
};
