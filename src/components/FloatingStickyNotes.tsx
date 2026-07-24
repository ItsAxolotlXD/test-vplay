import React, { useState, useEffect } from "react";
import { StickyNote, X, Minimize2, Maximize2, Pin, GripHorizontal, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Note } from "./vapps/VNotesTab";

export const FloatingStickyNotes: React.FC = () => {
  const [stuckNotes, setStuckNotes] = useState<Note[]>([]);
  const [minimizedNotes, setMinimizedNotes] = useState<Record<string, boolean>>({});

  const reloadStuckNotes = () => {
    try {
      const allNotesSaved = localStorage.getItem("vnotes_list");
      const stuckIdsSaved = localStorage.getItem("vnotes_stuck_ids");
      if (allNotesSaved && stuckIdsSaved) {
        const allNotes: Note[] = JSON.parse(allNotesSaved);
        const stuckIds: string[] = JSON.parse(stuckIdsSaved);
        const found = allNotes.filter((n) => stuckIds.includes(n.id));
        setStuckNotes(found);
      } else {
        setStuckNotes([]);
      }
    } catch (e) {
      console.error("Error loading stuck notes:", e);
    }
  };

  useEffect(() => {
    reloadStuckNotes();
    const handleUpdate = () => reloadStuckNotes();
    window.addEventListener("vnotes_stuck_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("vnotes_stuck_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleUnstick = (id: string) => {
    try {
      const stuckIdsSaved = localStorage.getItem("vnotes_stuck_ids");
      const stuckIds: string[] = stuckIdsSaved ? JSON.parse(stuckIdsSaved) : [];
      const updated = stuckIds.filter((item) => item !== id);
      localStorage.setItem("vnotes_stuck_ids", JSON.stringify(updated));
      window.dispatchEvent(new Event("vnotes_stuck_updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMinimize = (id: string) => {
    setMinimizedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (stuckNotes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      <AnimatePresence>
        {stuckNotes.map((note, index) => {
          const isMinimized = minimizedNotes[note.id];
          const plainText = note.content.replace(/<[^>]+>/g, "");
          const bgAccent = note.color || "#cc1827";

          return (
            <motion.div
              key={note.id}
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-auto absolute w-72 sm:w-80 rounded-2xl bg-[#1a1c23]/95 border-2 border-[#383c4a] shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col text-white overflow-hidden"
              style={{
                top: `${80 + (index % 4) * 35}px`,
                right: `${20 + (index % 3) * 25}px`
              }}
            >
              {/* Header Drag Handle */}
              <div 
                className="px-3.5 py-2.5 border-b border-[#2d313d] flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
                style={{ borderTop: `3px solid ${bgAccent}` }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GripHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: bgAccent }} />
                  <h4 className="text-xs font-mono font-bold text-white truncate flex-1">
                    {note.title || "Sticky Note"}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Stuck
                  </span>
                  <button
                    onClick={() => toggleMinimize(note.id)}
                    className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title={isMinimized ? "Phóng to" : "Thu nhỏ"}
                  >
                    {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleUnstick(note.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Bỏ ghim khỏi màn hình"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {!isMinimized && (
                <div className="p-3.5 text-xs text-slate-200 leading-relaxed font-sans max-h-60 overflow-y-auto custom-scrollbar select-text bg-[#12141a]/60">
                  <div
                    dangerouslySetInnerHTML={{ __html: note.content || "<p class='text-slate-500 italic'>Chưa có nội dung...</p>" }}
                    className="space-y-1"
                  />
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{note.category}</span>
                    <span>{note.updatedAt}</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
