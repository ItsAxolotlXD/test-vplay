import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Code, Copy, Check, Layers, Sliders, Database, Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/sound';

interface DataDrivenUiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataDrivenUiModal: React.FC<DataDrivenUiModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'components' | 'theme'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dduiSchemaJson = {
    "$schema": "https://vplay.tv/schemas/ddui.v1.json",
    "namespace": "vplay_ore_ui",
    "version": "2026.1.0",
    "theme": {
      "primary": "#418a28",
      "primary_hover": "#55b331",
      "surface_dark": "#3c3e41",
      "surface_panel": "#242628",
      "font_heading": "Jura, sans-serif",
      "font_body": "Montserrat, sans-serif"
    },
    "root_viewport": {
      "type": "panel",
      "size": ["100%", "100%"],
      "controls": [
        {
          "header_bar": {
            "type": "top_navigation",
            "bindings": [{ "binding_name": "#header_title", "binding_type": "global" }]
          }
        },
        {
          "panorama_background": {
            "type": "3d_canvas_renderer",
            "speed_binding": "#panorama_speed",
            "disable_binding": "#disable_panorama"
          }
        },
        {
          "content_grid": {
            "type": "responsive_grid",
            "columns": "auto-fit",
            "gap": 16,
            "children": "channel_cards_collection"
          }
        }
      ]
    },
    "data_bindings": {
      "channels_stream": "vplay.api.live_channels",
      "user_preferences": "vplay.storage.local_settings",
      "event_listeners": ["ON_CHANNEL_SELECT", "ON_SETTINGS_UPDATE", "ON_DEBUG_TOGGLE"]
    }
  };

  const jsonString = JSON.stringify(dduiSchemaJson, null, 2);

  const handleCopy = () => {
    playPopSound();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none font-jura">
      <div className="bg-[#3c3e41] border-2 border-[#141414] shadow-[inset_2px_2px_0_#5a5d61,inset_-2px_-2px_0_#222325,0_25px_60px_rgba(0,0,0,0.9)] w-full max-w-2xl text-white flex flex-col my-auto overflow-hidden animate-slide-in-left">
        
        {/* TOP BAR */}
        <div className="bg-[#242628] border-b-2 border-[#141414] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[#418a28] border border-[#141414] flex items-center justify-center text-white">
              <Code className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#55b331] uppercase tracking-wider flex items-center gap-2">
                Data-Driven UI (DDUI) Inspector
              </h2>
              <div className="text-[10px] text-zinc-400 font-mono">Vplay Minecraft Bedrock Edition Schema</div>
            </div>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-1 hover:bg-[#525559] active:bg-[#222426] border-2 border-[#141414] text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVIGATION SUB-TABS */}
        <div className="bg-[#2e3032] border-b-2 border-[#141414] px-3 py-1.5 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => { playPopSound(); setActiveTab('schema'); }}
            className={`px-3 py-1 border-2 border-[#141414] flex items-center gap-1.5 cursor-pointer text-xs ${
              activeTab === 'schema'
                ? 'bg-[#418a28] text-white shadow-[inset_1px_1px_0_#89dc69]'
                : 'bg-[#3c3e41] text-zinc-300 hover:bg-[#525559]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            JSON Schema
          </button>

          <button
            onClick={() => { playPopSound(); setActiveTab('components'); }}
            className={`px-3 py-1 border-2 border-[#141414] flex items-center gap-1.5 cursor-pointer text-xs ${
              activeTab === 'components'
                ? 'bg-[#418a28] text-white shadow-[inset_1px_1px_0_#89dc69]'
                : 'bg-[#3c3e41] text-zinc-300 hover:bg-[#525559]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Component Tree
          </button>

          <button
            onClick={() => { playPopSound(); setActiveTab('theme'); }}
            className={`px-3 py-1 border-2 border-[#141414] flex items-center gap-1.5 cursor-pointer text-xs ${
              activeTab === 'theme'
                ? 'bg-[#418a28] text-white shadow-[inset_1px_1px_0_#89dc69]'
                : 'bg-[#3c3e41] text-zinc-300 hover:bg-[#525559]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Theme Tokens
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-4 bg-[#1e2022] max-h-[60vh] overflow-y-auto font-mono text-xs">
          {activeTab === 'schema' && (
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2.5 py-1 bg-[#282a2c] hover:bg-[#3c3e41] text-white text-[11px] font-bold border-2 border-[#141414] flex items-center gap-1 cursor-pointer z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <pre className="text-[#89dc69] p-3 bg-[#121416] border-2 border-[#141414] overflow-x-auto text-[11px] leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-[#242628] border-2 border-[#141414]">
                <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> &lt;RootAppViewport /&gt;
                </div>
                <div className="pl-4 text-zinc-300 space-y-1">
                  <div>├── &lt;MinecraftPanorama canvas="3d_spin" /&gt;</div>
                  <div>├── &lt;HeaderBar title="CÀI ĐẶT" /&gt;</div>
                  <div>├── &lt;Sidebar active="settings" /&gt;</div>
                  <div>└── &lt;SettingsView mode="ore_ui_json" /&gt;</div>
                  <div className="pl-6 text-zinc-400">├── &lt;DeveloperOptions /&gt;</div>
                  <div className="pl-8 text-amber-300 font-bold">├── &lt;DataDrivenUiModal /&gt; [ACTIVE]</div>
                  <div className="pl-8 text-zinc-400">└── &lt;DevStatsOverlay fps="60" latency="16.7ms" /&gt;</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#242628] border-2 border-[#141414] space-y-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase block">UI Primary Palette</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#418a28] border border-black" />
                  <span className="text-white font-mono text-[11px]">#418a28 (Ore Green)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#55b331] border border-black" />
                  <span className="text-white font-mono text-[11px]">#55b331 (Hover Accent)</span>
                </div>
              </div>

              <div className="p-3 bg-[#242628] border-2 border-[#141414] space-y-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase block">Surface Paneling</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#3c3e41] border border-black" />
                  <span className="text-white font-mono text-[11px]">#3c3e41 (Bedrock Gray)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#1e2022] border border-black" />
                  <span className="text-white font-mono text-[11px]">#1e2022 (Dark Inset)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-[#242628] border-t-2 border-[#141414] p-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-400">Schema Engine: Bedrock DDUI v2026</span>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="px-5 py-2 bg-[#418a28] hover:bg-[#55b331] text-white font-bold text-xs uppercase border-2 border-[#141414] shadow-[inset_1px_1px_0_#89dc69] active:translate-y-[1px] cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
