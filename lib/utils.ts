import ms from 'ms'

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

