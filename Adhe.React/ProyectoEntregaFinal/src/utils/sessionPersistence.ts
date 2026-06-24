import type { UserInfo } from "../types/auth";

const SESSION_KEY: string = "tt_current_user";

export function getStoredSession(): UserInfo | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function setStoredSession(user: UserInfo | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}
