import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MicrophoneIcon,
  TranscriptionIcon,
  CancelIcon,
} from "../components/icons";
import "./RecordingOverlay.css";
import { commands } from "@/bindings";
import i18n, { syncLanguageFromSettings } from "@/i18n";
import { getLanguageDirection } from "@/lib/utils/rtl";

type OverlayState = "recording" | "transcribing" | "processing";

const RecordingOverlay: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<OverlayState>("recording");
  const [levels, setLevels] = useState<number[]>(Array(16).fill(0));
  const [previewText, setPreviewText] = useState("");
  const [animatedPreviewText, setAnimatedPreviewText] = useState("");
  const smoothedLevelsRef = useRef<number[]>(Array(16).fill(0));
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const direction = getLanguageDirection(i18n.language);

  useEffect(() => {
    const setupEventListeners = async () => {
      // Listen for show-overlay event from Rust
      const unlistenShow = await listen("show-overlay", async (event) => {
        // Sync language from settings each time overlay is shown
        await syncLanguageFromSettings();
        const overlayState = event.payload as OverlayState;
        setState(overlayState);
        setIsVisible(true);
      });

      // Listen for hide-overlay event from Rust
      const unlistenHide = await listen("hide-overlay", () => {
        setIsVisible(false);
        setPreviewText("");
        setAnimatedPreviewText("");
      });

      // Listen for mic-level updates
      const unlistenLevel = await listen<number[]>("mic-level", (event) => {
        const newLevels = event.payload as number[];

        // Apply smoothing to reduce jitter
        const smoothed = smoothedLevelsRef.current.map((prev, i) => {
          const target = newLevels[i] || 0;
          return prev * 0.7 + target * 0.3; // Smooth transition
        });

        smoothedLevelsRef.current = smoothed;
        setLevels(smoothed.slice(0, 9));
      });

      const unlistenPreview = await listen<string>(
        "overlay-transcription-preview",
        (event) => {
          const nextPreview = (event.payload || "").trim();
          setPreviewText(nextPreview);
        },
      );

      const unlistenClearPreview = await listen("overlay-clear-preview", () => {
        setPreviewText("");
        setAnimatedPreviewText("");
      });

      // Cleanup function
      return () => {
        unlistenShow();
        unlistenHide();
        unlistenLevel();
        unlistenPreview();
        unlistenClearPreview();
      };
    };

    setupEventListeners();
  }, []);

  useEffect(() => {
    if (!previewText) {
      setAnimatedPreviewText("");
      return;
    }

    setAnimatedPreviewText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += Math.max(1, Math.ceil((previewText.length - index) / 8));
      setAnimatedPreviewText(previewText.slice(0, index));
      if (index >= previewText.length) {
        window.clearInterval(timer);
      }
    }, 16);

    return () => window.clearInterval(timer);
  }, [previewText]);

  useEffect(() => {
    const node = previewScrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [animatedPreviewText, previewText]);

  const getIcon = () => {
    if (state === "recording") {
      return <MicrophoneIcon />;
    } else {
      return <TranscriptionIcon />;
    }
  };

  return (
    <div
      dir={direction}
      className={`recording-overlay ${isVisible ? "fade-in" : ""} ${previewText ? "with-preview" : ""}`}
    >
      <div className="overlay-left">{getIcon()}</div>

      <div className="overlay-middle">
        {state === "recording" && (
          <div className="transcribing-content">
            <div className="bars-container">
              {levels.map((v, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{
                    height: `${Math.min(20, 4 + Math.pow(v, 0.7) * 16)}px`, // Cap at 20px max height
                    transition: "height 60ms ease-out, opacity 120ms ease-out",
                    opacity: Math.max(0.2, v * 1.7), // Minimum opacity for visibility
                  }}
                />
              ))}
            </div>
            {(animatedPreviewText || previewText) && (
              <div className="preview-scroll" ref={previewScrollRef}>
                <div className="preview-text">{animatedPreviewText || previewText}</div>
              </div>
            )}
          </div>
        )}
        {state === "transcribing" && (
          <div className="transcribing-content">
            <div className="transcribing-text">{t("overlay.transcribing")}</div>
            {(animatedPreviewText || previewText) && (
              <div className="preview-scroll" ref={previewScrollRef}>
                <div className="preview-text">{animatedPreviewText || previewText}</div>
              </div>
            )}
          </div>
        )}
        {state === "processing" && (
          <div className="transcribing-content">
            <div className="transcribing-text">{t("overlay.processing")}</div>
            {(animatedPreviewText || previewText) && (
              <div className="preview-scroll" ref={previewScrollRef}>
                <div className="preview-text">{animatedPreviewText || previewText}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="overlay-right">
        {state === "recording" && (
          <div
            className="cancel-button"
            onClick={() => {
              commands.cancelOperation();
            }}
          >
            <CancelIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingOverlay;
