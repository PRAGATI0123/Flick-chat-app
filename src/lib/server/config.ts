import "server-only";

/** The chat API's address, from CHAT_API_BASE_URL (.env.local, or the hosting's environment variables). */
export function getApiBaseUrl() {
  const url = process.env.CHAT_API_BASE_URL;
  if (!url) {
    throw new Error("CHAT_API_BASE_URL is not set. Add it to .env.local (see .env.example).");
  }
  return url;
}
