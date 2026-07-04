// Dyktowanie głosowe — port webowego hooka.
// Działa tylko tam, gdzie dostępne jest Web Speech API (Expo Web / przeglądarka).
// Na natywnym iOS/Android `isSupported` jest false i przycisk "Dyktuj" się chowa.

import { useRef, useState, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getRecognitionCtor(): (new () => any) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  activeField: string | null;
  startListening: (fieldKey: string, onResult: (text: string) => void) => void;
  stopListening: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  // Wyznaczamy konstruktor w runtime (nie przy imporcie modułu), żeby detekcja
  // działała też gdy Web Speech API pojawia się po hydratacji.
  const [RecognitionCtor] = useState<(new () => any) | null>(() => getRecognitionCtor());
  const isSupported = RecognitionCtor !== null;

  const [activeField, setActiveField] = useState<string | null>(null);

  const recRef = useRef<any | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const activeFieldRef = useRef<string | null>(null);
  const onResultRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      activeFieldRef.current = null;
      try {
        recRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  function createAndStart() {
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
      if (finalText.trim() && onResultRef.current) {
        onResultRef.current(finalText.trim());
      }
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
            createAndStart();
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

  function startListening(fieldKey: string, onResult: (text: string) => void) {
    if (!RecognitionCtor) return;

    shouldKeepListeningRef.current = false;
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        /* ignore */
      }
      recRef.current = null;
    }

    activeFieldRef.current = fieldKey;
    onResultRef.current = onResult;
    shouldKeepListeningRef.current = true;

    createAndStart();
  }

  function stopListening() {
    shouldKeepListeningRef.current = false;
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

  return { isSupported, activeField, startListening, stopListening };
}
