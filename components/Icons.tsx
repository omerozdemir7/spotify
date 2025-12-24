
import React from 'react';

export const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732l7.5-4.33z"/>
  </svg>
);

export const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.533 1.27a9.262 9.262 0 016.291 16.04l5.278 5.279a1 1 0 01-1.414 1.414l-5.279-5.278a9.263 9.263 0 11-4.876-17.455zm0 2a7.263 7.263 0 100 14.526 7.263 7.263 0 000-14.526z"/>
  </svg>
);

export const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zM15.5 2.134A1 1 0 0116.5 2h1a1 1 0 011 1v18a1 1 0 01-1 1h-1a1 1 0 01-1-.866L15.5 2.134zM6.469 4.01a1 1 0 01.996-.875l.93-.01a1 1 0 011.004 1.005l-.01 16.864a1 1 0 01-1 1h-.95a1 1 0 01-1-.976l.03-17.008z"/>
  </svg>
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/>
  </svg>
);

export const PauseIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm9 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"/>
  </svg>
);

export const SkipForwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.7 3a.7.7 0 00-.7.7v6.917L5.05 3.606a.7.7 0 00-1.05.606v15.576a.7.7 0 001.05.606L17 13.383V20.3a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"/>
  </svg>
);

export const SkipBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.3 3a.7.7 0 01.7.7v6.917L18.95 3.606a.7.7 0 011.05.606v15.576a.7.7 0 01-1.05.606L7 13.383V20.3a.7.7 0 01-.7.7H3.7a.7.7 0 01-.7-.7V3.7a.7.7 0 01.7-.7h2.6z"/>
  </svg>
);

export const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.97-3.906A1.25 1.25 0 011.5 10.158V5.842c0-.469.262-.894.671-1.09l6.97-3.902a.75.75 0 01.6-.001zm-1.116 2.016L2.95 6.06a.25.25 0 00-.125.218v3.444c0 .088.046.168.125.212l5.675 3.18V2.866z"/>
    <path d="M11.5 8c0-1.332-.777-2.484-1.905-3.024a.25.25 0 01-.115-.34L10.02 3.61a.25.25 0 01.335-.115C11.96 4.304 13 5.962 13 8s-1.04 3.696-2.645 4.505a.25.25 0 01-.335-.115l-.54-.9a.25.25 0 01.115-.34C10.723 10.484 11.5 9.332 11.5 8z"/>
  </svg>
);
