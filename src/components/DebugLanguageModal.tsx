import React, { useState, useEffect, useRef } from 'react';
import { X, Save, RotateCcw, Download, Upload, Bug, FileCode, List, Search, Plus, Check, Copy } from 'lucide-react';
import { useLang, DEFAULT_VPLAY_LANG } from '../context/LanguageContext';
import { playPopSound } from '../utils/sound';

export const DebugLanguageModal: React.FC = () => {
  const {
    langRawContent,
    langMap,
    setLangRawContent,
    resetToDefaultLang,
    isDebugModalOpen,
    setIsDebugModalOpen,
    t,
  } = useLang();

  const [activeTab, setActiveTab] = useState<'raw' | 'table'>('raw');
  const [editedText, setEditedText] = useState(langRawContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync edited text when modal opens or raw content changes externally
  useEffect(() => {
    setEditedText(langRawContent);
  }, [langRawContent, isDebugModalOpen]);

  if (!isDebugModalOpen) return null;

  const showStatus = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => {
      setStatusMsg(null);
    }, 3000);
  };

  const handleSave = () => {
    playPopSound();
    setLangRawContent(editedText);
    showStatus('Đã lưu và áp dụng vplay.lang cho toàn bộ ứng dụng!', 'success');
  };

  const handleReset = () => {
    playPopSound();
    if (window.confirm('Bạn có chắc chắn muốn khôi phục file vplay.lang về mặc định không?')) {
      resetToDefaultLang();
      setEditedText(DEFAULT_VPLAY_LANG);
      showStatus('Đã khôi phục file vplay.lang về mặc định!', 'info');
    }
  };

  const handleExport = () => {
    playPopSound();
    const blob = new Blob([editedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vplay.lang';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('Đã xuất file vplay.lang thành công!', 'success');
  };

  const handleImportClick = () => {
    playPopSound();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setEditedText(content);
          setLangRawContent(content);
          showStatus(`Đã nhập file ${file.name} thành công!`, 'success');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    playPopSound();
    navigator.clipboard?.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNewPair = () => {
    if (!newKey.trim()) return;
    playPopSound();
    const key = newKey.trim();
    const val = newValue.trim();
    const updated = editedText + `\n${key}=${val}`;
    setEditedText(updated);
    setLangRawContent(updated);
    setNewKey('');
    setNewValue('');
    showStatus(`Đã thêm key mới: ${key}`, 'success');
  };

  const handleUpdateKeyValue = (keyToUpdate: string, newVal: string) => {
    const lines = editedText.split('\n');
    let found = false;
    const newLines = lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//')) {
        const eqIdx = line.indexOf('=');
        if (eqIdx > 0) {
          const k = line.substring(0, eqIdx).trim();
          if (k === keyToUpdate) {
            found = true;
            return `${keyToUpdate}=${newVal}`;
          }
        }
      }
      return line;
    });

    if (!found) {
      newLines.push(`${keyToUpdate}=${newVal}`);
    }

    const nextText = newLines.join('\n');
    setEditedText(nextText);
    setLangRawContent(nextText);
  };

  // Filter keys for visual table editor
  const filteredKeys = Object.keys(langMap).filter((k) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return k.toLowerCase().includes(q) || (langMap[k] && langMap[k].toLowerCase().includes(q));
  });

  const rawLineCount = editedText.split('\n').length;
  const keyCount = Object.keys(langMap).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-montserrat select-none animate-fade-in">
      {/* Hidden File Input for .lang import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".lang,.txt,.properties"
        className="hidden"
      />

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-[#292b2e] border-4 border-[#141414] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        
        {/* HEADER BAR */}
        <div className="bg-[#36383b] border-b-2 border-[#141414] p-3 flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#d90429] flex items-center justify-center border-2 border-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <Bug className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-wide text-white drop-shadow">
                DEBUG MODE — FILE LANGUAGE EDITOR (<span className="text-white underline">vplay.lang</span>)
              </h2>
              <p className="text-[10px] text-white/90 font-medium">
                Chỉnh sửa ngôn ngữ & văn bản thời gian thực toàn bộ ứng dụng Vplay
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPopSound();
              setIsDebugModalOpen(false);
            }}
            className="w-8 h-8 bg-[#292b2e] hover:bg-[#141414] text-white font-bold flex items-center justify-center border-2 border-[#141414] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-[1px] cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* TOP STATUS & TAB SWITCHER */}
        <div className="bg-[#36383b] border-b border-[#141414] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPopSound();
                setActiveTab('raw');
              }}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] border-2 border-[#141414] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-[#55585c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] border-white/60'
                  : 'bg-[#292b2e] text-white/80 hover:text-white hover:bg-[#414447]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-white" />
              Raw Editor (vplay.lang)
            </button>

            <button
              onClick={() => {
                playPopSound();
                setActiveTab('table');
              }}
              className={`px-3 py-1.5 font-bold uppercase text-[11px] border-2 border-[#141414] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-[#55585c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] border-white/60'
                  : 'bg-[#292b2e] text-white/80 hover:text-white hover:bg-[#414447]'
              }`}
            >
              <List className="w-3.5 h-3.5 text-white" />
              Visual Table ({keyCount} Keys)
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Lines: <strong className="text-white font-mono">{rawLineCount}</strong></span>
            </span>
            <span>Keys: <strong className="text-white font-mono">{keyCount}</strong></span>
          </div>
        </div>

        {/* STATUS MESSAGE TOAST */}
        {statusMsg && (
          <div
            className={`px-3 py-1.5 text-xs font-bold border-b border-[#141414] flex items-center justify-between ${
              statusMsg.type === 'success'
                ? 'bg-[#2a7221] text-white'
                : statusMsg.type === 'info'
                ? 'bg-[#2b6cb0] text-white'
                : 'bg-[#c53030] text-white'
            }`}
          >
            <span>{statusMsg.text}</span>
            <Check className="w-4 h-4" />
          </div>
        )}

        {/* EDITOR BODY */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#1e2022] space-y-3">
          
          {/* TAB 1: RAW FILE EDITOR */}
          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-white font-mono bg-[#141517] px-3 py-1.5 border border-[#2b2d30]">
                <span>FILE: <strong className="text-white underline">vplay.lang</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-white hover:underline flex items-center gap-1 cursor-pointer text-[10px] uppercase font-bold"
                  >
                    <Copy className="w-3 h-3 text-white" />
                    {copied ? 'ĐÃ COPY!' : 'COPY CODE'}
                  </button>
                </div>
              </div>

              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Nhập nội dung vplay.lang (key=value)..."
                rows={16}
                spellCheck={false}
                className="w-full bg-[#121315] text-white font-mono text-xs p-3 border-2 border-[#141414] focus:outline-none focus:border-white leading-relaxed shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] resize-y"
              />

              <div className="text-[11px] text-white bg-[#292b2e] p-2.5 border border-[#141414] flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <strong className="text-white">Cấu trúc ví dụ:</strong>
                  <code className="block text-white font-bold mt-0.5 font-mono bg-[#141517] px-2 py-0.5 border border-white/20">
                    home.tab.DesignPreview.name=WELCOME TO A DESIGN PREVIEW
                  </code>
                </div>
                <div className="text-[10px] text-white self-end">
                  Nhấn <strong className="text-white uppercase underline">LƯU VÀ ÁP DỤNG</strong> để cập nhật giao diện ứng dụng.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL TABLE EDITOR */}
          {activeTab === 'table' && (
            <div className="space-y-3">
              {/* Search & Add Key Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                <div className="md:col-span-6 relative">
                  <img src="https://static.wikia.nocookie.net/ep-deo/images/a/a4/MagnifyingGlass.png/revision/latest?cb=20260730091531" className="absolute left-2.5 top-2.5 w-4 h-4 object-contain pointer-events-none" referrerPolicy="no-referrer" alt="Search" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Lọc theo key hoặc giá trị..."
                    className="w-full h-9 bg-[#121315] text-white placeholder:text-white/60 pl-9 pr-3 text-xs border border-[#141414] focus:outline-none focus:border-white"
                  />
                </div>

                <div className="md:col-span-6 flex gap-1.5">
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Tên key mới (ví dụ: app.welcome)"
                    className="flex-1 h-9 bg-[#121315] text-white placeholder:text-white/60 px-2 text-xs border border-[#141414] focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Giá trị"
                    className="flex-1 h-9 bg-[#121315] text-white placeholder:text-white/60 px-2 text-xs border border-[#141414] focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={handleAddNewPair}
                    className="bg-[#418a28] hover:bg-[#4ea230] text-white font-bold text-xs px-3 h-9 border border-[#141414] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" /> THÊM
                  </button>
                </div>
              </div>

              {/* Table List */}
              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                {filteredKeys.length > 0 ? (
                  filteredKeys.map((key) => (
                    <div
                      key={key}
                      className="bg-[#2a2c2f] border border-[#141414] p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                    >
                      <div className="sm:w-1/3 min-w-0">
                        <span className="font-mono text-xs font-bold text-white break-all">
                          {key}
                        </span>
                      </div>
                      <div className="sm:w-2/3 w-full flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={langMap[key] || ''}
                          onBlur={(e) => {
                            if (e.target.value !== langMap[key]) {
                              handleUpdateKeyValue(key, e.target.value);
                              showStatus(`Đã cập nhật ${key}`, 'success');
                            }
                          }}
                          className="w-full bg-[#161719] text-white px-2.5 py-1.5 text-xs border border-[#141414] focus:outline-none focus:border-white font-sans"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-white bg-[#25272a] border border-[#141414]">
                    Không tìm thấy key nào khớp với "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LIVE DEMO PREVIEW BOX */}
          <div className="bg-[#292b2e] border-2 border-[#141414] p-3 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-white flex items-center justify-between">
              <span className="text-white">LIVE PREVIEW — CÁC PHẦN TỬ ĐANG ÁP DỤNG vplay.lang</span>
              <span className="text-white/80">cập nhật tức thì</span>
            </div>
            <div className="bg-[#18191b] p-2.5 border border-[#141414] space-y-2">
              <div>
                <span className="text-[10px] text-white/80 font-mono block">home.tab.DesignPreview.name:</span>
                <span className="font-bold text-xs text-white uppercase font-jura">
                  {t('home.tab.DesignPreview.name', 'WELCOME TO A DESIGN PREVIEW')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-white/80 font-mono block">home.tab.DesignPreview.desc:</span>
                <p className="text-xs text-white leading-snug">
                  {t('home.tab.DesignPreview.desc', 'Bạn đang được trải nghiệm hệ thống giao diện mới của Vplay...')}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION TOOLBAR */}
        <div className="bg-[#36383b] border-t-2 border-[#141414] p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSave}
              className="bg-[#418a28] hover:bg-[#4ea230] active:bg-[#367320] text-white font-black text-xs uppercase border-2 border-[#141414] py-2 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_0_#141414] active:translate-y-[1px] btn-press-effect cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              LƯU VÀ ÁP DỤNG
            </button>

            <button
              onClick={handleExport}
              className="bg-[#7b2cbf] hover:bg-[#8f39df] text-white font-black text-xs uppercase border-2 border-[#141414] py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_0_#141414] active:translate-y-[1px] btn-press-effect cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              TẢI VPLAY.LANG
            </button>

            <button
              onClick={handleImportClick}
              className="bg-[#2b6cb0] hover:bg-[#3182ce] text-white font-black text-xs uppercase border-2 border-[#141414] py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_0_#141414] active:translate-y-[1px] btn-press-effect cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              NHẬP FILE .LANG
            </button>
          </div>

          <button
            onClick={handleReset}
            className="bg-[#3c3f42] hover:bg-[#4d5155] text-gray-200 font-bold text-xs uppercase border-2 border-[#141414] py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_0_#141414] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            KHÔI PHỤC MẶC ĐỊNH
          </button>
        </div>

      </div>
    </div>
  );
};
