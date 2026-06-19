'use client';

export const THEME_KEY = 'codeorda-theme';

export function getStoredTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

export function applyTheme(theme: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export const themeScript = `
(function(){
  var t = localStorage.getItem('codeorda-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();
`;
