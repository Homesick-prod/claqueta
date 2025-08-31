import React from 'react';

export default function ThemeScript() {
  const script = `
    (function() {
      try {
        const theme = localStorage.getItem('ui.theme') || 'dark';
        const density = localStorage.getItem('ui.density') || 'cozy';
        const reduceMotion = localStorage.getItem('ui.reduceMotion') === 'true';
        
        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          document.documentElement.setAttribute('data-theme', theme);
        }
        
        document.documentElement.setAttribute('data-density', density);
        
        if (reduceMotion) {
          document.documentElement.setAttribute('data-reduce-motion', 'true');
        }
      } catch (e) {}
    })();
  `;
  
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}