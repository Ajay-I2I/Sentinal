"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const windowWithSpeech = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return (
    windowWithSpeech.SpeechRecognition ??
    windowWithSpeech.webkitSpeechRecognition ??
    null
  );
}

export function useVoiceInput(onResult: (transcript: string) => void) {
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      if (CONFIG.ENABLE_LOGGING) {
        console.log("🎤 Requesting microphone permission...");
      }
      setDebugInfo("🔐 Requesting microphone permission...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (CONFIG.ENABLE_LOGGING) {
        console.log("✅ Microphone permission granted");
      }
      setDebugInfo("✅ Microphone permission granted");
      
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error("❌ Microphone permission denied:", error);
      setDebugInfo("❌ Microphone permission denied. Please allow access.");
      setUnsupported(true);
      return false;
    }
  }, []);

  const startListening = useCallback(async () => {
    try {
      const SpeechRecognition = getSpeechRecognition();

      if (!SpeechRecognition) {
        console.error("❌ Speech Recognition API not supported in this browser");
        setUnsupported(true);
        setDebugInfo("❌ Speech Recognition not supported");
        return;
      }

      if (CONFIG.ENABLE_LOGGING) {
        console.log("✅ Speech Recognition API available");
      }
      setDebugInfo("🔐 Checking permissions...");

      // First, request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      if (CONFIG.ENABLE_LOGGING) {
        console.log("✅ Starting speech recognition");
      }
      setDebugInfo("✅ API available, starting...");

      // Clear any existing timeouts
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      setTranscript("");
      setInterimTranscript("");

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      if (CONFIG.ENABLE_LOGGING) {
        console.log("🎤 Recognition settings:", {
          lang: recognition.lang,
          continuous: recognition.continuous,
          interimResults: recognition.interimResults,
        });
      }

      recognition.onstart = () => {
        if (CONFIG.ENABLE_LOGGING) {
          console.log("✅ Speech recognition started - listening for audio");
        }
        setListening(true);
        setDebugInfo("🎤 Listening... Speak now (waiting for audio)");

        // Set a timeout in case no speech is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = setTimeout(() => {
          if (CONFIG.ENABLE_LOGGING) {
            console.log("⚠️ No speech detected for 10 seconds");
          }
          setDebugInfo("⚠️ No speech detected. Try speaking louder or closer to mic.");
        }, CONFIG.SPEECH_TIMEOUT_MS);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Clear the silence timeout since we got audio
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        if (CONFIG.ENABLE_LOGGING) {
          console.log("📝 Result event:", {
            resultIndex: (event as any).resultIndex,
            resultsLength: event.results.length,
          });
        }

        const evt = event as any;
        const resultIndex = evt.resultIndex || 0;

        let interimText = "";
        let finalText = "";

        for (let i = resultIndex; i < evt.results.length; i++) {
          const result = evt.results[i];
          const resultTranscript = result[0]?.transcript || "";

          if (CONFIG.ENABLE_LOGGING) {
            console.log(`Result ${i}:`, {
              transcript: resultTranscript,
              isFinal: result.isFinal,
              confidence: result[0]?.confidence,
            });
          }

          if (result.isFinal) {
            finalText += resultTranscript + " ";
          } else {
            interimText += resultTranscript;
          }
        }

        if (CONFIG.ENABLE_LOGGING) {
          console.log("Text captured:", { finalText, interimText });
        }

        setTranscript((prev) => {
          const updated = prev + finalText;
          if (CONFIG.ENABLE_LOGGING) {
            console.log("Updated transcript:", updated);
          }
          return updated;
        });
        setInterimTranscript(interimText);
        setDebugInfo(`📝 Interim: ${interimText || finalText}`);

        // Clear existing timeout
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }

        // Set new timeout for 5 seconds of silence
        pauseTimeoutRef.current = setTimeout(() => {
          if (CONFIG.ENABLE_LOGGING) {
            console.log(`⏱️ ${CONFIG.VOICE_PAUSE_THRESHOLD_MS}ms pause detected - sending message`);
          }
          const fullTranscript = (transcript + interimText).trim();
          if (CONFIG.ENABLE_LOGGING) {
            console.log("Full transcript to send:", fullTranscript);
          }

          if (fullTranscript) {
            recognition.stop();
            setListening(false);
            onResult(fullTranscript);
            setTranscript("");
            setInterimTranscript("");
            setDebugInfo("✅ Message sent!");
          }
        }, CONFIG.VOICE_PAUSE_THRESHOLD_MS);
      };

      recognition.onend = () => {
        if (CONFIG.ENABLE_LOGGING) {
          console.log("❌ Speech recognition ended");
        }
        setListening(false);
        setDebugInfo("⏹️ Recognition ended");

        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        const fullTranscript = (transcript + interimTranscript).trim();
        if (CONFIG.ENABLE_LOGGING) {
          console.log("On end - full transcript:", fullTranscript);
        }

        if (fullTranscript) {
          if (CONFIG.ENABLE_LOGGING) {
            console.log("Sending transcript on end:", fullTranscript);
          }
          onResult(fullTranscript);
        }
        setTranscript("");
        setInterimTranscript("");
      };

      recognition.onerror = (event: any) => {
        console.error("❌ Speech recognition error:", event.error);
        setDebugInfo(`❌ Error: ${event.error} - Try speaking louder or closer to your microphone`);
        setListening(false);

        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        // Auto-restart on no-speech error after a delay
        if (event.error === "no-speech") {
          if (CONFIG.ENABLE_LOGGING) {
            console.log("🔄 Restarting due to no-speech error...");
          }
          setTimeout(() => {
            if (CONFIG.ENABLE_LOGGING) {
              console.log("🚀 Attempting to restart recognition");
            }
            try {
              recognition.start();
              setListening(true);
              setDebugInfo("🔄 Restarting... Speak now");
            } catch (err) {
              console.error("Failed to restart:", err);
            }
          }, 1000);
        }
      };

      if (CONFIG.ENABLE_LOGGING) {
        console.log("🚀 Starting recognition...");
      }
      recognition.start();
      setDebugInfo("🚀 Starting...");
    } catch (error) {
      console.error("❌ Error starting speech recognition:", error);
      setDebugInfo(`❌ Error: ${error}`);
      setUnsupported(true);
    }
  }, [onResult, transcript, interimTranscript, requestMicrophonePermission]);

  const stopListening = useCallback(() => {
    if (CONFIG.ENABLE_LOGGING) {
      console.log("🛑 Stopping listening");
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    setListening(false);
    setTranscript("");
    setInterimTranscript("");
    setDebugInfo("⏹️ Stopped");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    listening,
    unsupported,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    debugInfo,
  };
}

