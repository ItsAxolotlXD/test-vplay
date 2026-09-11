import React, { useState, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  Music,
  Film,
  Trash2,
  Check,
  Sparkles,
  Loader2,
  FileAudio,
  Radio,
  Clock,
  Plus
} from 'lucide-react';
import {
  CustomAlarmSound,
  ALARM_TONE_PRESETS,
  clockAudio,
  extractAudioFromFile
} from './clockAudio';

interface AlarmSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedToneId: string;
  onSelectTone: (toneId: string) => void;
  customSounds: CustomAlarmSound[];
  onUpdateCustomSounds: (sounds: CustomAlarmSound[]) => void;
}

export const AlarmSoundModal: React.FC<AlarmSoundModalProps> = ({
  isOpen,
  onClose,
  selectedToneId,
  onSelectTone,
  customSounds,
  onUpdateCustomSounds
}) => {
  const [playingToneId, setPlayingToneId] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePreviewTone = (toneId: string) => {
    if (playingToneId === toneId) {
      clockAudio.stopPreview();
      setPlayingToneId(null);
      return;
    }

    setPlayingToneId(toneId);
    clockAudio.previewSound(toneId, customSounds, () => {
      setPlayingToneId(null);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsExtracting(true);
    setExtractError(null);
    setExtractSuccess(null);

    try {
      const extracted = await extractAudioFromFile(file);
      const newSound: CustomAlarmSound = {
        id: `custom_${Date.now()}`,
        name: extracted.name || file.name,
        sourceType: extracted.sourceType,
        dataUrl: extracted.dataUrl,
        duration: Math.round(extracted.duration * 10) / 10,
        createdAt: Date.now(),
        originalFileName: file.name,
        fileSizeText: extracted.fileSizeText
      };

      const updated = [newSound, ...customSounds];
      onUpdateCustomSounds(updated);
      onSelectTone(newSound.id);
      
      const successMsg = extracted.sourceType === 'video_extracted'
        ? `Đã trích xuất thành công âm thanh từ video "${file.name}"!`
        : `Đã tải lên tệp âm thanh "${file.name}"!`;
      setExtractSuccess(successMsg);
      setTimeout(() => setExtractSuccess(null), 3500);

      // Auto preview new sound
      handlePreviewTone(newSound.id);
    } catch (err: any) {
      console.error('Audio extraction failed:', err);
      setExtractError('Không thể trích xuất âm thanh từ tệp này. Vui lòng thử file MP3, WAV hoặc MP4 khác!');
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteCustomSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingToneId === id) {
      clockAudio.stopPreview();
      setPlayingToneId(null);
    }
    const filtered = customSounds.filter((s) => s.id !== id);
    onUpdateCustomSounds(filtered);
    if (selectedToneId === id) {
      onSelectTone('chime');
    }
  };

  const handleClose = () => {
    clockAudio.stopPreview();
    setPlayingToneId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#161928] border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#121422]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Cài Đặt & Đổi Âm Thanh Báo Thức
              </h3>
              <p className="text-xs text-slate-400">
                Chọn giai điệu có sẵn hoặc tải lên file âm thanh MP3/WAV hoặc trích xuất từ Video
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* 1. UPLOAD & VIDEO EXTRACTION DROPZONE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tự Tải File Âm Thanh Hoặc Trích Xuất Từ Video</span>
              </label>
              <span className="text-[11px] text-cyan-400 font-mono">
                MP3, WAV, AAC, MP4, WebM, MOV
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
                  : 'border-cyan-500/30 bg-[#131624] hover:bg-[#181C2E] hover:border-cyan-400/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*,.mp3,.wav,.ogg,.m4a,.aac,.mp4,.webm,.mov,.mkv"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              {isExtracting ? (
                <div className="py-3 flex flex-col items-center gap-2.5 text-cyan-300">
                  <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
                  <p className="text-xs font-semibold animate-pulse">
                    Đang giải mã và trích xuất dải âm thanh từ file...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">
                      Nhấp để chọn file hoặc kéo thả tệp vào đây
                    </p>
                    <p className="text-xs text-slate-400 max-w-md">
                      Hệ thống tự động phát hiện và trích xuất âm thanh chất lượng cao từ file video MP4/WebM hoặc tải trực tiếp file nhạc MP3/WAV làm chuông báo.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-[11px] font-semibold border border-cyan-500/30">
                    <Plus className="w-3.5 h-3.5" />
                    Tải Tệp Lên Ngay
                  </span>
                </>
              )}
            </div>

            {/* Notification messages */}
            {extractSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{extractSuccess}</span>
              </div>
            )}
            {extractError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <VolumeX className="w-4 h-4 shrink-0" />
                <span>{extractError}</span>
              </div>
            )}
          </div>

          {/* 2. CUSTOM EXTRACTED / UPLOADED SOUNDS LIST */}
          {customSounds.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Âm Thanh Đã Tải Lên & Trích Xuất ({customSounds.length})</span>
                </span>
                <span className="text-[11px] text-slate-400">Đã lưu trong máy</span>
              </label>

              <div className="space-y-2">
                {customSounds.map((sound) => {
                  const isSelected = selectedToneId === sound.id;
                  const isPlaying = playingToneId === sound.id;

                  return (
                    <div
                      key={sound.id}
                      onClick={() => onSelectTone(sound.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                          : 'bg-[#131624] border-white/5 hover:border-white/20 hover:bg-[#181C2E]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Radio Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40'
                              : 'border border-white/20 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>

                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          sound.sourceType === 'video_extracted'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        }`}>
                          {sound.sourceType === 'video_extracted' ? (
                            <Film className="w-4 h-4" />
                          ) : (
                            <FileAudio className="w-4 h-4" />
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {sound.name}
                            </span>
                            {sound.sourceType === 'video_extracted' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                                Trích xuất video
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Thời lượng: ~{sound.duration}s</span>
                            {sound.fileSizeText && <span>• {sound.fileSizeText}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right actions: Preview & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewTone(sound.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPlaying
                              ? 'bg-cyan-400 text-slate-950 animate-pulse shadow-md shadow-cyan-400/30'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          }`}
                          title={isPlaying ? 'Dừng phát' : 'Nghe thử'}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Dừng</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Nghe thử</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomSound(sound.id, e)}
                          className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Xóa âm thanh này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. PRESET SYNTHESIZER SOUNDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kho Giai Điệu Báo Thức Có Sẵn (Presets)</span>
              </label>
              <span className="text-[11px] text-slate-400">Âm thanh độc quyền</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALARM_TONE_PRESETS.map((preset) => {
                const isSelected = selectedToneId === preset.id;
                const isPlaying = playingToneId === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectTone(preset.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400'
                        : 'bg-[#131624] border-white/5 hover:border-white/20 hover:bg-[#181C2E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40'
                              : 'border border-white/20 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-sm font-bold text-white">
                          {preset.name}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10 shrink-0">
                        {preset.tag}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewTone(preset.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-cyan-400 text-slate-950 animate-pulse shadow-md shadow-cyan-400/30'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title={isPlaying ? 'Dừng phát' : 'Nghe thử giai điệu'}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>Đang phát...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Thử chuông</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#121422] flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            <span>Đang chọn: </span>
            <span className="font-bold text-cyan-300">
              {customSounds.find((s) => s.id === selectedToneId)?.name ||
                ALARM_TONE_PRESETS.find((p) => p.id === selectedToneId)?.name ||
                'Giai Điệu Vplay (Melody Chime)'}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 cursor-pointer"
          >
            Lưu & Áp Dụng
          </button>
        </div>

      </div>
    </div>
  );
};
