import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Channel } from '../types';

interface LiveTVProps {
  currentChannel?: Channel;
  onSelectChannel?: (channel: Channel) => void;
  channels?: Channel[];
  onOpenCustomStreamModal?: () => void;
}

export const LiveTV: React.FC<LiveTVProps> = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 sm:px-6">
      <div className="max-w-xl w-full text-center space-y-6">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Truyền hình is not available
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-lg mx-auto">
          To watch TV channels provided by Vplay and our community without interruptions, please visit the official Vplay website.
        </p>

        {/* Colored Button */}
        <div className="pt-2">
          <a
            id="btn-livetv-official-website"
            href="https://v0-vplay-preview.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E50914] to-[#E6005A] text-white font-bold text-sm sm:text-base shadow-[0_8px_30px_rgba(229,9,20,0.35)] hover:shadow-[0_12px_40px_rgba(230,0,90,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Check official website</span>
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>
    </div>
  );
};
