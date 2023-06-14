import ms from 'ms'
import { cookies } from 'next/headers';

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never'
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? '' : ' ago'
  }`
}


export const cookie_read = (name: string) => {
  const result = new RegExp("(?:^|; )" + encodeURIComponent(name) + "=([^;]*)").exec(document.cookie);
  return result ? result[1] : null;
};

export const cookie_write = (name: string, value: string, days?: number) => {
  if (!days) {
      days = 365 * 20;
  }

  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

  const expires = "; expires=" + date.toUTCString();

  document.cookie = name + "=" + value + expires + "; path=/";
};

export const cookie_remove = (name: string) => {
  cookie_write(name, "", -1);
};

export const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = isProduction ? "https://covalent-wallet-watcher.vercel.app" : "http://localhost:3000";
