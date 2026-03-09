/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Lock, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ACCESS_CODE = "125800";

const REAL_ASSETS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/JPY", "EUR/JPY", "GBP/JPY", "USD/CAD", "AUD/CAD", "EUR/GBP", "USD/CHF"];
const OTC_ASSETS = ["USD/ARS(OTC)", "USD/BDT(OTC)", "USD/EGP(OTC)", "USD/INR(OTC)", "USD/IDR(OTC)", "USD/MXN(OTC)", "EUR/AUD(OTC)", "EUR/CHF(OTC)", "EUR/SGD(OTC)", "GBP/CHF(OTC)", "NZD/CAD(OTC)", "AUD/NZD(OTC)", "CAD/CHF(OTC)", "EUR/NZD(OTC)", "USD/PHP(OTC)", "GBP/NZD(OTC)", "USD/BRL(OTC)", "USD/ZAR(OTC)", "EUR/CAD(OTC)", "AUD/CHF(OTC)", "CHF/JPY(OTC)", "NZD/CHF(OTC)", "USD/COP(OTC)", "USD/DZD(OTC)", "USD/NGN(OTC)", "USD/TRY(OTC)", "USD/PKR(OTC)", "NZD/JPY(OTC)", "NZD/USD(OTC)"];
const CRYPTO_ASSETS = ["Bitcoin (OTC)", "Axie Infinity (OTC)", "Polkadot (OTC)", "Ethereum Classic (OTC)", "Ethereum (OTC)", "Floki (OTC)", "Gala (OTC)", "Hamster Kombat (OTC)", "Chainlink (OTC)", "Litecoin (OTC)", "Melania Meme (OTC)", "Pepe (OTC)", "Shiba Inu (OTC)", "Solana (OTC)", "Toncoin (OTC)", "Trump (OTC)", "Dogwifhat (OTC)", "Zcash (OTC)", "TRON (OTC)", "Bonk (OTC)", "Ripple (OTC)", "Cardano (OTC)", "Avalanche (OTC)", "Arbitrum (OTC)", "Cosmos (OTC)", "Bitcoin Cash (OTC)", "Decentraland (OTC)", "Beam (OTC)", "Dogecoin (OTC)", "Dash (OTC)", "Aptos (OTC)", "Binance Coin (OTC)", "Celestia (OTC)"];

export default function App() {
  const [market, setMarket] = useState('REAL');
  const [assetSearch, setAssetSearch] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [direction, setDirection] = useState('BOTH');
  const [timeframe, setTimeframe] = useState('M1');
  const [count, setCount] = useState(5);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('21:00');
  const [signals, setSignals] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessInput, setAccessInput] = useState('');
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentAssets = useMemo(() => {
    if (market === 'REAL') return REAL_ASSETS;
    if (market === 'OTC') return OTC_ASSETS;
    return CRYPTO_ASSETS;
  }, [market]);

  const filteredAssets = useMemo(() => {
    if (!assetSearch) return [];
    return currentAssets.filter(a => a.toUpperCase().includes(assetSearch.toUpperCase()));
  }, [assetSearch, currentAssets]);

  const handleAssetSelect = (asset: string) => {
    if (!selectedAssets.includes(asset)) {
      setSelectedAssets([...selectedAssets, asset]);
    }
    setAssetSearch('');
    setShowDropdown(false);
  };

  const removeAsset = (asset: string) => {
    setSelectedAssets(selectedAssets.filter(a => a !== asset));
  };

  const openAccess = () => {
    if (selectedAssets.length === 0) {
      alert("Select at least one asset");
      return;
    }
    setIsModalOpen(true);
  };

  const checkAccess = () => {
    if (accessInput === ACCESS_CODE) {
      setIsModalOpen(false);
      setAccessInput('');
      generateSignals();
    } else {
      alert("Invalid Access Code");
    }
  };

  const generateSignals = async () => {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (endMin <= startMin) {
      alert("End Time must be greater than Start Time");
      return;
    }
    if ((endMin - startMin) < count) {
      alert("Time range too small for this many signals");
      return;
    }

    setSignals([]);
    const steps = ["itBD Ai Signal Generating...", "Ai Signal Filtering...", "Quotex API Testing..."];
    
    for (const step of steps) {
      setLoadingStep(step);
      const delay = Math.floor(Math.random() * 2000) + 1500; // Reduced delay for better UX in preview
      await new Promise(r => setTimeout(r, delay));
    }
    setLoadingStep(null);

    const usedTimes = new Set<number>();
    let attempts = 0;
    while (usedTimes.size < count && attempts < 10000) {
      const randMin = Math.floor(Math.random() * (endMin - startMin - 1)) + startMin + 1;
      usedTimes.add(randMin);
      attempts++;
    }
    const timeArray = Array.from(usedTimes).sort((a, b) => a - b);

    const newSignals: string[] = [];
    timeArray.forEach((current, index) => {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      const currentAsset = selectedAssets[index % selectedAssets.length];
      const assetFormatted = currentAsset.replace("(OTC)", "-OTC").replace("/", "");
      const dir = direction === "CALL" ? "BUY" : direction === "PUT" ? "PUT" : Math.random() > 0.5 ? "BUY" : "PUT";
      newSignals.push(`${h}:${m}:${assetFormatted}:${dir}`);
    });

    setSignals(newSignals);
  };

  const getSignalMessage = () => {
    if (signals.length === 0) return "";
    const dateStr = new Date().toLocaleDateString("en-GB").replace(/\//g, ".");
    return `🌐 TIMEZONE :UTC+06:00 🇧🇩\n🗓 DATE-${dateStr}\n➡️ MTG +1\n\n┏━━━❰⭐️itBD EXTREME⭐️❱━━━┓\n\n${signals.join('\n')}\n\n┗━━━❰⭐️itBD EXTREME⭐️❱━━━┛`;
  };

  const copySignals = () => {
    if (signals.length === 0) {
      alert("Generate signals first!");
      return;
    }
    const msg = getSignalMessage();
    navigator.clipboard.writeText(msg);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050b16] text-white font-sans selection:bg-cyan-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#0f1b2e,#050b16)] pointer-events-none" />

      <div className="relative container max-w-[520px] mx-auto px-5 py-8">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img 
            src="https://i.ibb.co.com/W4CG21z8/Chat-GPT-Image-Feb-26-2026-11-13-39-PM.png" 
            alt="itBD Ai Logo" 
            className="max-w-[320px] w-full mx-auto rounded-xl shadow-2xl shadow-cyan-500/10"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111a2e]/75 backdrop-blur-xl rounded-[20px] p-6 shadow-[0_0_40px_rgba(0,255,200,0.08)] border border-white/5"
        >
          {/* Market Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">Market</label>
              <select 
                value={market}
                onChange={(e) => {
                  setMarket(e.target.value);
                  setSelectedAssets([]);
                }}
                className="w-full p-3.5 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="REAL">Real Market</option>
                <option value="OTC">OTC Market</option>
                <option value="CRYPTO">Crypto OTC</option>
              </select>
            </div>

            {/* Asset Search */}
            <div className="relative">
              <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">🔍 Search Asset</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={assetSearch}
                  onChange={(e) => {
                    setAssetSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search and select asset..."
                  className="w-full p-3.5 pl-10 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8fa3c7]" />
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && filteredAssets.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute w-full mt-2 bg-[#0c1628] border border-white/5 rounded-xl max-h-48 overflow-y-auto z-50 shadow-2xl"
                  >
                    {filteredAssets.map((asset) => (
                      <div 
                        key={asset}
                        onClick={() => handleAssetSelect(asset)}
                        className="p-3 hover:bg-[#16233d] cursor-pointer text-sm transition-colors border-b border-white/5 last:border-0"
                      >
                        {asset}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Assets Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedAssets.map((asset) => (
                <motion.div 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={asset}
                  className="bg-[#16233d] px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 border border-white/5"
                >
                  {asset}
                  <button onClick={() => removeAsset(asset)} className="text-red-400 hover:text-red-300 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Direction */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">Direction</label>
              <select 
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="BOTH">Call & Put (Auto)</option>
                <option value="CALL">Call Only</option>
                <option value="PUT">Put Only</option>
              </select>
            </div>

            {/* Timeframe */}
            <div>
              <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">Timeframe</label>
              <div className="flex gap-2">
                {['M1', 'M5', 'M15', 'M30'].map((tf) => (
                  <button 
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      timeframe === tf 
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black border-transparent shadow-lg shadow-cyan-500/20' 
                        : 'bg-[#0c1628] border-white/5 text-white hover:bg-[#16233d]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">Number of Signals</label>
                <input 
                  type="number" 
                  value={count}
                  onChange={(e) => setCount(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full p-3.5 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">Start Time</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#8fa3c7] font-semibold mb-1.5 block">End Time</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-white/5 bg-[#0c1628] text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button 
              onClick={openAccess}
              disabled={!!loadingStep}
              className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-lg shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStep ? 'Processing...' : 'Generate AI Signals'}
            </button>

            {/* Signal Box */}
            <div className="mt-6 space-y-3">
              <div className="bg-[#061021] rounded-xl p-4 min-h-[100px] max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed border border-white/5">
                {loadingStep ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 space-y-2">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-cyan-400 font-bold animate-pulse">{loadingStep}</p>
                  </div>
                ) : signals.length > 0 ? (
                  <pre className="whitespace-pre-wrap text-[#00ffc8]">{getSignalMessage()}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full py-8 text-[#8fa3c7] italic">
                    Signals will appear here...
                  </div>
                )}
              </div>

              {signals.length > 0 && (
                <button 
                  onClick={copySignals}
                  className="w-full py-3.5 rounded-xl bg-[#111f38] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#16233d] transition-all border border-white/5"
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied!' : '📋 Copy All Signals'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Access Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-5">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0c1628] p-8 rounded-[24px] w-full max-w-[380px] text-center shadow-2xl border border-white/10"
            >
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">🔐 Premium Access</h3>
              <p className="text-sm text-[#8fa3c7] mb-6">Enter your access code to unlock AI signal generation.</p>
              
              <input 
                type="password" 
                value={accessInput}
                onChange={(e) => setAccessInput(e.target.value)}
                placeholder="Enter Access Code"
                className="w-full p-4 rounded-xl border border-white/5 bg-[#061021] text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 mb-6"
              />
              
              <button 
                onClick={checkAccess}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Unlock Now
              </button>
              
              <div className="mt-6 text-xs text-[#8fa3c7]">
                Need access? Contact: <br />
                <a href="https://t.me/ITBD_Parvej" target="_blank" rel="noreferrer" className="text-cyan-400 font-bold hover:underline mt-1 inline-block">@ITBD_Parvej</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
