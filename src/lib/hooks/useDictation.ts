"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDictationProps {
  onResult: (text: string) => void;
  enableShortcut?: boolean; // Automatically bind to double-tap Shift
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    webkitAudioContext: any;
  }
}

export function useDictation({ onResult, enableShortcut = true }: UseDictationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState("");
  
  // Ref synced with state for easy access in closures (like keyboard events)
  const isRecordingRef = useRef(false);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastShiftTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize roughly between 0 and 1 using some math so it feels reactive
        setVolume(Math.min(1, avg / 128)); 
        rafRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Web Speech API for transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let final = "";
          let interim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final) {
             onResult(final.trim());
          }
          setInterimTranscript(interim);
        };
        
        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error", e.error);
        };

        recognition.onend = () => {
           // Autorestart if we didn't deliberately stop it (e.g. silence timeout)
           if (isRecordingRef.current) {
               try { recognition.start(); } catch(e) {}
           }
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
      
      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (err) {
      console.error("Mic access denied or error:", err);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  }, [onResult]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    isRecordingRef.current = false;
    setVolume(0);
    setInterimTranscript("");
    
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // drop the autorestart listener
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecordingRef.current) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [startRecording, stopRecording]);

  useEffect(() => {
    if (!enableShortcut) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Must be plain Control (no meta, shift, or alt)
      if (e.key === 'Control' && !e.altKey && !e.shiftKey && !e.metaKey) {
        if (isRecordingRef.current) {
          e.preventDefault();
          stopRecording();
          lastShiftTimeRef.current = 0;
        } else {
          const now = Date.now();
          // If second shift tap happens within 350ms of the first
          if (now - lastShiftTimeRef.current < 350) {
            e.preventDefault();
            startRecording();
            lastShiftTimeRef.current = 0; // reset
          } else {
            lastShiftTimeRef.current = now;
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableShortcut, startRecording, stopRecording]);

  useEffect(() => {
      return () => {
          if (isRecordingRef.current) stopRecording();
      }
  }, [stopRecording]);

  return {
    isRecording,
    toggleRecording,
    volume,
    interimTranscript
  };
}
