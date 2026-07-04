import { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Browser capability check
// ---------------------------------------------------------------------------

function getRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const RecognitionCtor = getRecognitionCtor();

// ---------------------------------------------------------------------------
// Public interface (unchanged — AddRecipeModal depends on this shape)
// ---------------------------------------------------------------------------

export interface UseSpeechRecognitionResult {
  isSupported:    boolean;
  activeField:    string | null;
  startListening: (fieldKey: string, onResult: (text: string) => void) => void;
  stopListening:  () => void;
}

// ---------------------------------------------------------------------------
// Hook
//
// Uses the continuous auto-restart pattern:
//   - recognition.continuous = true  →  no gaps while the user speaks
//   - onend auto-restarts (150 ms delay) while shouldKeepListeningRef is true
//   - activeFieldRef / onResultRef hold the current targets in a stable ref
//     so the restart closure never captures stale values
// ---------------------------------------------------------------------------

export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const isSupported = RecognitionCtor !== null;

  const [activeField, setActiveField] = useState<string | null>(null);

  const recRef               = useRef<SpeechRecognition | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const activeFieldRef       = useRef<string | null>(null);
  const onResultRef          = useRef<((text: string) => void) | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      activeFieldRef.current = null;
      try { recRef.current?.abort(); } catch { /* ignore */ }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Internal: create a fresh recognition instance and start it
  // ---------------------------------------------------------------------------

  function createAndStart() {
    if (!RecognitionCtor || !activeFieldRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (RecognitionCtor as any)() as SpeechRecognition;
    rec.lang            = "pl-PL";
    rec.continuous      = true;   // keep listening without gaps
    rec.interimResults  = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event: SpeechRecognitionEvent) => {
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

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "no-speech" and "aborted" are expected — do not surface as errors
      const ignored = ["no-speech", "aborted"];
      if (!ignored.includes(event.error)) {
        console.warn("useSpeechRecognition error:", event.error);
      }
    };

    rec.onend = () => {
      recRef.current = null;
      // Auto-restart as long as the user hasn't pressed Stop
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

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  function startListening(fieldKey: string, onResult: (text: string) => void) {
    if (!RecognitionCtor) return;

    // Tear down any running session first
    shouldKeepListeningRef.current = false;
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* ignore */ }
      recRef.current = null;
    }

    // Arm the new session
    activeFieldRef.current = fieldKey;
    onResultRef.current    = onResult;
    shouldKeepListeningRef.current = true;

    createAndStart();
  }

  function stopListening() {
    shouldKeepListeningRef.current = false;
    activeFieldRef.current  = null;
    onResultRef.current     = null;
    setActiveField(null);

    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* ignore */ }
      recRef.current = null;
    }
  }

  return { isSupported, activeField, startListening, stopListening };
}
