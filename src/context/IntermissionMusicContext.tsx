import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface IntermissionMusicContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: (e?: React.MouseEvent) => void;
  toggleMute: (e?: React.MouseEvent) => void;
  setVolume: (v: number, e?: React.MouseEvent) => void;
  boostMaxVolume: () => void;
  isActive: boolean;
}

const IntermissionMusicContext = createContext<IntermissionMusicContextValue | null>(null);

export const useIntermissionMusic = () => {
  const context = useContext(IntermissionMusicContext);
  if (!context) {
    // Provide safe fallback if accessed outside provider
    return {
      isPlaying: true,
      isMuted: false,
      volume: 100,
      togglePlay: () => {},
      toggleMute: () => {},
      setVolume: () => {},
      boostMaxVolume: () => {},
      isActive: false,
    };
  }
  return context;
};

interface IntermissionMusicProviderProps {
  children: React.ReactNode;
  isActive: boolean; // active when showBrandTransitionScreen || isOobeOpen
}

export const IntermissionMusicProvider: React.FC<IntermissionMusicProviderProps> = ({
  children,
  isActive,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(100);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // YouTube video ID: ijS5whAOX3Q (Minecraft Live 2023 - Intermission Music)
  const videoId = 'ijS5whAOX3Q';
  // Include volume=100 in initial embed parameters and set up API controls
  const youtubeUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&enablejsapi=1&controls=0&playsinline=1&modestbranding=1&volume=100`;

  const sendCommand = useCallback((func: string, args: (string | number)[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      } catch {}
    }
  }, []);

  const boostMaxVolume = useCallback(() => {
    try {
      sendCommand('unMute');
      sendCommand('setVolume', [100]);
    } catch {}
  }, [sendCommand]);

  // Repeatedly boost volume during startup
  useEffect(() => {
    if (!isActive) return;

    boostMaxVolume();
    const pulseIntervals = [400, 1000, 1800, 2600, 4200];
    const timers = pulseIntervals.map((ms) =>
      setTimeout(() => {
        boostMaxVolume();
      }, ms)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isActive, boostMaxVolume]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      sendCommand('setVolume', [volume]);
      setIsPlaying(true);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [100]);
      setIsMuted(false);
      setVolumeState(100);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  };

  const setVolume = (newVol: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sendCommand('unMute');
    sendCommand('setVolume', [newVol]);
    setIsMuted(false);
    setVolumeState(newVol);
  };

  return (
    <IntermissionMusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        toggleMute,
        setVolume,
        boostMaxVolume,
        isActive,
      }}
    >
      {children}

      {/* Hidden YouTube Iframe that loops the intermission music continuously with maximum volume across Intermission & OOBE */}
      {isActive && (
        <iframe
          ref={iframeRef}
          src={youtubeUrl}
          title="Intermission Music"
          allow="autoplay; encrypted-media"
          onLoad={boostMaxVolume}
          className="w-0 h-0 opacity-0 pointer-events-none fixed -top-[9999px] -left-[9999px]"
        />
      )}
    </IntermissionMusicContext.Provider>
  );
};
