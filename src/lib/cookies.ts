// Tiny client-side cookie helpers. Kept outside React components so cookie
// writes are plain side-effecting functions, not in-component mutations.

const WEEK = 60 * 60 * 24 * 7;

export function setCookie(name: string, value: string, maxAge = WEEK) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
