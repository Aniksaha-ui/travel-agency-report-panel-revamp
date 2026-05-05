import { useState } from "react";
import { toast } from "react-toastify";
import { classNames } from "../../utils/classNames";

function CopyIcon({ copied }) {
  if (copied) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function CopyButton({
  className,
  copyTextValue,
  copiedLabel = "Copied",
  emptyMessage = "Nothing to copy.",
  successMessage = "Copied to clipboard.",
  title = "Copy",
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const normalizedValue = String(copyTextValue ?? "");

    if (!normalizedValue.trim()) {
      toast.error(emptyMessage);
      return;
    }

    try {
      await copyText(normalizedValue);
      setCopied(true);
      toast.success(successMessage);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      toast.error("Unable to copy right now.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames("btn btn-outline-secondary btn-icon btn-sm", className)}
      aria-label={copied ? copiedLabel : title}
      title={copied ? copiedLabel : title}
    >
      <CopyIcon copied={copied} />
    </button>
  );
}
