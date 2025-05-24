import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Wifi } from 'lucide-react';

export default function ErrorPage() {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };
  
<div className=" bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-scroll"></div>
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900  overflow-scroll">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main error card */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            
            {/* Error Icon */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border-4 border-red-400/50 animate-ping"></div>
              <div className="absolute inset-2 rounded-full border-4 border-red-400/30 animate-ping delay-200"></div>
            </div>
            
            {/* Error message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                Oops! Something Went Wrong
              </h1>
              <p className="text-white/80 text-lg">
                We encountered an unexpected error. Don't worry, it's not your fault!
              </p>
            </div>

            {/* Error details */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex items-center justify-center text-sm">
                <Wifi className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-white/70">Connection Error</span>
              </div>
              <p className="text-white/60 text-xs mt-2">
                Please check your connection and try again
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleRefresh}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button 
                onClick={handleGoHome}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </div>
          </div>

          {/* Help text */}
          <div className={`text-center mt-6 transform transition-all duration-1000 delay-300 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="text-white/50 text-sm">
              If the problem persists, please contact support 📞
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}