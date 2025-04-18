import { useEffect, useState } from 'react';

export const DarkModeSwitch = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    // const root = window.document.documentElement;
    // if (isDark) {
    //   root.classList.add('dark');
    //   localStorage.setItem('theme', 'dark');
    // } else {
    //   root.classList.remove('dark');
    //   localStorage.setItem('theme', 'light');
    // }
  }, [isDark]);

  return (
      <></>
    // <button
    //   onClick={() => setIsDark(!isDark)}
    //   className="bg-primary-500 text-primary-foreground dark:bg-primary dark:text-primary-foreground px-4 py-2 rounded"
    // >
    //   {isDark ? '☀️' : '🌙'}
    // </button>
  );
}
