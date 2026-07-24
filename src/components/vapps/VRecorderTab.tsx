import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Download,
  Trash2,
  Volume2,
  Clock,
  Sparkles,
  Radio
} from "lucide-react";

export interface Recording {
  id: string;
  name: string;
  url: string;
  duration: number;
  timestamp: string;
}

export const VRecorderTab: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRec: Recording = {
          id: `rec-${Date.now()}`,
          name: `Bản ghi âm #${recordings.length + 1}`,
          url: audioUrl,
          duration: recordingTime,
          timestamp: new Date().toLocaleTimeString("vi-VN")
        };
        setRecordings((prev) => [newRec, ...prev]);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Không thể truy cập Microphone. Vui lòng cấp quyền trong trình duyệt.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const togglePlay = (rec: Recording) => {
    if (activePlayingId === rec.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setActivePlayingId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(rec.url);
      audioPlayerRef.current = audio;
      audio.play();
      setActivePlayingId(rec.id);
      audio.onended = () => setActivePlayingId(null);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 text-white font-sans">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-6 rounded-3xl bg-gradient-to-r from-red-950/70 via-zinc-900 to-black border border-red-500/30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl shadow-lg shadow-red-500/20 text-white font-black">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-red-300 uppercase">
                V-Recorder Voice Studio
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black uppercase tracking-wider">
                Ghi Âm Chất Lượng Cao
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Trình thu âm chuyên nghiệp hỗ trợ xuất file âm thanh và sóng phát lại.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Console */}
      <div className="bg-[#18181c] border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl text-center flex flex-col items-center justify-center">
        {/* Animated Sound Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-20 mb-6">
          {[40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 35, 75].map((h, i) => (
            <div
              key={i}
              style={{ height: isRecording ? `${Math.random() * 80 + 20}%` : "20%" }}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-4xl font-mono font-black text-white mb-6 tracking-widest">
          {formatSeconds(recordingTime)}
        </div>

        {/* Record / Stop Button */}
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl shadow-red-600/40 transition-all cursor-pointer active:scale-95"
          >
            <Mic className="w-5 h-5" /> Bắt Đầu Ghi Âm
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-3 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border-2 border-red-500 text-red-400 font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            <Square className="w-5 h-5 text-red-500" /> Dừng Thu Âm
          </button>
        )}
      </div>

      {/* Recordings List */}
      <div className="bg-[#18181c] border border-white/10 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-red-400" /> Danh sách bản ghi âm ({recordings.length})
        </h3>

        {recordings.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs">
            Chưa có bản ghi âm nào. Hãy nhấn "Bắt Đầu Ghi Âm".
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePlay(rec)}
                    className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {activePlayingId === rec.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white">{rec.name}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-2">
                      <span>{rec.timestamp}</span> • <span>{formatSeconds(rec.duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={rec.url}
                    download={`${rec.name}.webm`}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 transition-all"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
