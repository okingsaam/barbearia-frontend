import { useEffect, useMemo, useState } from "react";
import { API_REQUEST_STATUS_EVENT } from "../services/api";

const INITIAL_FEEDBACK = { type: "", message: "" };

function ApiRequestFeedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);

  useEffect(() => {
    const handleRequestStatus = (event) => {
      const payload = event.detail;

      if (!payload) {
        return;
      }

      if (payload.type === "loading") {
        setIsLoading(Boolean(payload.isLoading));
        return;
      }

      if (payload.type === "error") {
        setFeedback({
          type: "error",
          message: payload.message || "Erro inesperado ao comunicar com a API.",
        });
      }
    };

    window.addEventListener(API_REQUEST_STATUS_EVENT, handleRequestStatus);

    return () => {
      window.removeEventListener(API_REQUEST_STATUS_EVENT, handleRequestStatus);
    };
  }, []);

  useEffect(() => {
    if (!feedback.message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback(INITIAL_FEEDBACK);
    }, 4200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [feedback.message]);

  const feedbackClassName = useMemo(() => {
    if (!feedback.message) {
      return "api-feedback-toast";
    }

    return `api-feedback-toast api-feedback-toast-${feedback.type}`;
  }, [feedback.message, feedback.type]);

  return (
    <>
      <div
        className={`api-loading-bar ${isLoading ? "api-loading-bar-visible" : ""}`}
        aria-hidden="true"
      />

      <div className={feedbackClassName} role="status" aria-live="polite">
        {feedback.message}
      </div>
    </>
  );
}

export default ApiRequestFeedback;
