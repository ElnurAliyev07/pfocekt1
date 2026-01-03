'use client'

import React from 'react';
import Sun from '../icons/Sun';
import Moon from '../icons/Moon';
import useThemeStore from '@/store/themeStore';

const ThemeChanger = () => {
  const {isDarkMode, toggleTheme} = useThemeStore()


  return (
    <div className={`theme-container ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label="Toggle Theme"
      >
        {isDarkMode ? <Moon /> : <Sun />}
      </button>
    </div>
  );
};

export default ThemeChanger;
