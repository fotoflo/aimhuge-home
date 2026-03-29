/**
 * Shared Chromium launcher — provides executablePath and args for Puppeteer.
 * On Vercel: uses @sparticuz/chromium-min.
 * Locally (macOS): uses system Chrome.
 */

import { existsSync } from "node:fs";

const IS_DEPLOYED = process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview";

const LOCAL_CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

export async function getChromiumLaunchConfig(): Promise<{
  executablePath: string;
  args: string[];
}> {
  if (IS_DEPLOYED) {
    try {
      // @sparticuz/chromium-min is only installed on Vercel
      const chromium = (await import(/* webpackIgnore: true */ "@sparticuz/chromium-min" as string)).default;
      const url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`;
      return {
        executablePath: await chromium.executablePath(url),
        args: chromium.args,
      };
    } catch {
      throw new Error("@sparticuz/chromium-min not available in deployed environment");
    }
  }

  const localPath = LOCAL_CHROME_PATHS.find((p) => existsSync(p));
  if (!localPath) {
    throw new Error(`No local Chrome found. Searched: ${LOCAL_CHROME_PATHS.join(", ")}`);
  }

  return {
    executablePath: localPath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
}
