
import React from 'react';

export const COLORS = {
  primary: '#f59e0b', // Vibrant Amber
  secondary: '#d97706', // Deep Amber
  accent: '#fbbf24', // Lighter Amber
  danger: '#EF4444', 
  edu: '#8B5CF6', 
  background: '#fffbeb',
  darkText: '#451a03',
};

export const LOGO_ICON = (
  <svg viewBox="0 0 24 24" className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Geometric Base - Abstract 'P' / Bar Chart */}
    <rect x="4" y="14" width="4" height="6" rx="1" fill="url(#iconGrad)" />
    <rect x="10" y="8" width="4" height="12" rx="1" fill="url(#iconGrad)" fillOpacity="0.8" />
    <path d="M16 4V20H20V6C20 4.89543 19.1046 4 18 4H16Z" fill="url(#iconGrad)" fillOpacity="0.6" />
    
    {/* The 'PRO' Accent - Floating Diamond/Orb */}
    <circle cx="18" cy="6" r="3" fill="#fbbf24" filter="url(#glowEffect)" />
    
    {/* Dynamic Connection Line */}
    <path d="M6 14L12 8L18 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);