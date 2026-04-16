import { useEffect, useRef, useState, useCallback } from "react";

// Minimal types for the Web Speech API
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

export type SpeechStatus = "idle" | "recording" | "transcribing" | "error";

export function useSpeechRecognition(lang = "fr-FR") {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef<string>("");

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalRef.current += text + " ";
        } else {
          interimText += text;
        }
      }
      setTranscript(finalRef.current);
      setInterim(interimText);
    };
    rec.onerror = (ev) => {
      setError(ev.error);
      setStatus("error");
    };
    rec.onend = () => {
      setStatus((prev) => (prev === "recording" ? "idle" : prev));
      setInterim("");
    };
    recognitionRef.current = rec;
    return () => {
      try { rec.abort(); } catch { /* noop */ }
    };
  }, [lang]);

  const start = useCallback((initial = "") => {
    if (!recognitionRef.current) return;
    finalRef.current = initial ? initial.trimEnd() + " " : "";
    setTranscript(finalRef.current);
    setInterim("");
    setError(null);
    try {
      recognitionRef.current.start();
      setStatus("recording");
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    setStatus("transcribing");
    try {
      recognitionRef.current.stop();
    } catch { /* noop */ }
    // Brief delay for the UX of "Transcription en cours…"
    setTimeout(() => {
      setStatus("idle");
    }, 600);
  }, []);

  return { status, transcript, interim, error, supported, start, stop };
}
