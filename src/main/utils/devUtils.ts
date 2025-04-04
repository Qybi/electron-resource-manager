import { join } from "path";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getUiPath(): string {
  return join(__dirname, "../renderer/index.html");
}
