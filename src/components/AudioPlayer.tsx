import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl: string;
  height?: number;
}

export default function AudioPlayer({ audioUrl, height = 64 }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let wavesurfer: any = null;

    const initWavesurfer = async () => {
      if (!waveformRef.current) return;

      try {
        // Dynamically import wavesurfer to avoid SSR issues
        const WaveSurfer = (await import("wavesurfer.js")).default;

        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "hsl(var(--muted))",
          progressColor: "hsl(var(--primary))",
          cursorColor: "hsl(var(--primary))",
          barWidth: 2,
          barRadius: 3,
          barGap: 2,
          height: height,
          normalize: true,
          backend: "WebAudio",
        });

        wavesurferRef.current = wavesurfer;

        wavesurfer.load(audioUrl);

        wavesurfer.on("ready", () => {
          setIsLoading(false);
        });

        wavesurfer.on("play", () => setIsPlaying(true));
        wavesurfer.on("pause", () => setIsPlaying(false));
        wavesurfer.on("finish", () => setIsPlaying(false));
      } catch (error) {
        console.error("Error loading wavesurfer:", error);
        setIsLoading(false);
      }
    };

    initWavesurfer();

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [audioUrl, height]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="relative w-full">
      <div
        ref={waveformRef}
        className={`w-full ${isLoading ? "opacity-50" : "opacity-100"} transition-opacity`}
      />
      <Button
        onClick={togglePlayPause}
        disabled={isLoading}
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur hover:bg-background/90"
        data-testid="button-play-pause"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
