export const TEXT = "Racing against time, I sprinted through the shadows and suddenly, a monstrous creature appeared right in front of me!";

export const COLOR_SCHEME = {
  background: "#0a0e17",
  surface: "#111827",
  accent: "#3b82f6",
  success: "#10b981",
  error: "#ef4444",
  text: {
    primary: "#f3f4f6",
    secondary: "#9ca3af",
    typed: "#60a5fa",
    future: "#4b5563"
  }
};

export const NON_PRINTABLE_KEYS = new Set([
  "Enter", "Tab", "Escape", "Shift", "Meta", "CapsLock", "Control",
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Home", "End", "PageUp", "PageDown",
  "Insert", "PrintScreen", "Pause",
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
  "NumLock", "ScrollLock", "Alt", "ContextMenu"
]);