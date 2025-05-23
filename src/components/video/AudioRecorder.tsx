import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Pause, Trash2, Save } from 'lucide-react';
import { AudioManager } from '../../lib/video/audio';
import { cn } from '../../lib/utils';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export function AudioRecorder({ onSave, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioManager = useRef<AudioManager | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioManager.current = new AudioManager();
    
    return () => {
      audioManager.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveformRef.current && audioManager.current) {
      audioManager.current.initializeWaveform(waveformRef.current);
    }
  }, [waveformRef.current]);

  const startRecording = async () => {
    try {
      await audioManager.current?.initializeRecorder();
      audioManager.current?.startRecording();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await audioManager.current?.stopRecording();
      if (blob) {
        setRecordedBlob(blob);
        await audioManager.current?.loadAudio(blob);
      }
      setIsRecording(false);
    } catch (err) {
      setError('Failed to stop recording.');
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      audioManager.current?.pause();
    } else {
      audioManager.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSave = () => {
    if (recordedBlob) {
      onSave(recordedBlob);
    }
  };

  return (
    <div className="bg-terminal-darkGreen p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Audio Recorder</h3>
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
      </div>

      <div ref={waveformRef} className="h-16 bg-terminal-black rounded" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "p-2 rounded-full transition-colors",
              isRecording 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-terminal-green hover:bg-terminal-green/90"
            )}
          >
            <Mic className={cn(
              "w-5 h-5",
              isRecording ? "text-white animate-pulse" : "text-black"
            )} />
          </button>

          {recordedBlob && (
            <button
              onClick={togglePlayback}
              className="p-2 bg-terminal-black rounded-full hover:bg-terminal-black/70"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-terminal-black rounded-full"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>

          {recordedBlob && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-terminal-green text-black rounded font-bold hover:bg-terminal-green/90"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}