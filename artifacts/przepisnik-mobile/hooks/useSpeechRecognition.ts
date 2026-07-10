import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";

import { transcribeAudio } from "../lib/api";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getRecognitionCtor(): (new () => any) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  activeField: string | null;
  isProcessing: boolean;
  startListening: (fieldKey: string, onResult: (text: string) => void) => Promise<void>;
  stopListening: () => Promise<void>;
}

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [RecognitionCtor] = useState<(new () => any) | null>(() => getRecognitionCtor());
  const isWebSpeechSupported = Platform.OS === "web" && RecognitionCtor !== null;
  const isNativeSpeechSupported = Platform.OS !== "web";
  const isSupported = isWebSpeechSupported || isNativeSpeechSupported;

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [activeField, setActiveField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recRef = useRef<any | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const activeFieldRef = useRef<string | null>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    (async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch {
        /* Expo Go may defer audio mode until permission is granted. */
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      activeFieldRef.current = null;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
      if (Platform.OS !== "web" && audioRecorder.isRecording) {
        void audioRecorder.stop();
      }
    };
  }, [audioRecorder]);

  function appendResult(text: string) {
    const trimmed = text.trim();
    if (trimmed && onResultRef.current) {
      onResultRef.current(trimmed);
    }
  }

  function createAndStartWeb() {
    if (!RecognitionCtor || !activeFieldRef.current) return;

    const rec = new (RecognitionCtor as any)();
    rec.lang = "pl-PL";
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }
      appendResult(finalText);
    };

    rec.onerror = (event: any) => {
      const ignored = ["no-speech", "aborted"];
      if (!ignored.includes(event?.error)) {
        console.warn("useSpeechRecognition error:", event?.error);
      }
    };

    rec.onend = () => {
      recRef.current = null;
      if (shouldKeepListeningRef.current && activeFieldRef.current) {
        setTimeout(() => {
          if (shouldKeepListeningRef.current && activeFieldRef.current) {
            createAndStartWeb();
          }
        }, 150);
      } else {
        setActiveField(null);
        activeFieldRef.current = null;
      }
    };

    recRef.current = rec;
    try {
      rec.start();
      setActiveField(activeFieldRef.current);
    } catch (err) {
      console.warn("useSpeechRecognition: could not start —", err);
      recRef.current = null;
      setActiveField(null);
    }
  }

  async function startNativeRecording(fieldKey: string, onResult: (text: string) => void) {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Mikrofon", "Zezwól aplikacji na dostęp do mikrofonu, żeby używać dyktowania.");
      return;
    }

    onResultRef.current = onResult;
    activeFieldRef.current = fieldKey;
    setActiveField(fieldKey);

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  }

  async function stopNativeRecording() {
    const field = activeFieldRef.current;
    activeFieldRef.current = null;
    setActiveField(null);

    if (!field || !audioRecorder.isRecording) return;

    setIsProcessing(true);
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (!uri) throw new Error("Nie udało się zapisać nagrania.");
      const text = await transcribeAudio(uri, "audio/mp4");
      appendResult(text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Nie udało się przepisać nagrania.";
      Alert.alert("Dyktowanie", msg);
    } finally {
      setIsProcessing(false);
    }
  }

  async function startListening(fieldKey: string, onResult: (text: string) => void) {
    if (!isSupported) return;

    shouldKeepListeningRef.current = false;
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        /* ignore */
      }
      recRef.current = null;
    }

    if (Platform.OS !== "web") {
      await stopNativeRecording();
      await startNativeRecording(fieldKey, onResult);
      return;
    }

    activeFieldRef.current = fieldKey;
    onResultRef.current = onResult;
    shouldKeepListeningRef.current = true;
    createAndStartWeb();
  }

  async function stopListening() {
    shouldKeepListeningRef.current = false;

    if (Platform.OS !== "web") {
      await stopNativeRecording();
      onResultRef.current = null;
      return;
    }

    activeFieldRef.current = null;
    onResultRef.current = null;
    setActiveField(null);

    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        /* ignore */
      }
      recRef.current = null;
    }
  }

  return { isSupported, activeField, isProcessing, startListening, stopListening };
}
