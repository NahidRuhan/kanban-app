'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="group relative flex items-center justify-center w-10 h-10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-[var(--ease-spring)] focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700"
      title="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
