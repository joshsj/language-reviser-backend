type LoggerMode = "info" | "good" | "bad";
type Logger = (s: string, mode?: LoggerMode) => void;

type AccentHelper = {
  next: (char: string) => string;
};

export { LoggerMode, Logger, AccentHelper };
