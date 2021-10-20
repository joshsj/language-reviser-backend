type LoggerMode = "info" | "good" | "bad";
type Logger = (s: string, mode?: LoggerMode) => void;

export { LoggerMode, Logger };
