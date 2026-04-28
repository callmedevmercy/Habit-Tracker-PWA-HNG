import React from 'react';

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand text-background" data-testid="splash-screen">
      <h1 className="text-5xl font-serif font-bold tracking-wide">Habit Tracker</h1>
    </div>
  );
}
