const levels = { debug: 10, info: 20, warn: 30, error: 40 } as const;
type Level = keyof typeof levels;

const current: Level = (process.env.LOG_LEVEL as Level) in levels ? (process.env.LOG_LEVEL as Level) : "info";

function log(level: Level, msg: string, extra?: unknown) {
  if (levels[level] < levels[current]) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${msg}`;
  const out = level === "error" || level === "warn" ? console.error : console.log;
  if (extra === undefined) out(line);
  else out(line, extra instanceof Error ? extra.stack || extra.message : extra);
}

export const logger = {
  debug: (m: string, e?: unknown) => log("debug", m, e),
  info: (m: string, e?: unknown) => log("info", m, e),
  warn: (m: string, e?: unknown) => log("warn", m, e),
  error: (m: string, e?: unknown) => log("error", m, e),
};
