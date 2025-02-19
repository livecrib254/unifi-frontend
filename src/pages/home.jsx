import React from 'react';
import { useState } from 'react';
import { Wifi, WifiOff, Loader2, Globe } from 'lucide-react';

const StatusMessage = ({ type, message, internetAccess }) => {
  if (!message) return null;
  
  const getStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  return (
    <div className={`mt-4 p-4 rounded-lg border ${getStyles()}`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span>{message}</span>
      </div>
      {type === 'success' && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4" />
          <span>Internet Access: {internetAccess ? 'Available' : 'Limited'}</span>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [status, setStatus] = useState({
    loading: false,
    type: null,
    message: '',
    internetAccess: false
  });

  const authenticateUser = async () => {
    setStatus({ 
      loading: true, 
      type: null, 
      message: '', 
      internetAccess: false 
    });

    try {
      const response = await fetch('http://localhost:5000/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
       console.log(data)
      if (!response.ok) {
        let errorMessage = 'Authentication failed. Please try again.';
        
        // Handle specific error cases
        if (response.status === 404) {
          errorMessage = 'No device found. Please check your connection.';
        }
        
        setStatus({
          loading: false,
          type: 'error',
          message: data.message || errorMessage,
          internetAccess: false
        });
        return;
      }

      if (data.success) {
        setStatus({
          loading: false,
          type: 'success',
          message: `Connected successfully! MAC: ${data.mac}`,
          internetAccess: data.internetAccess
        });
      } else {
        setStatus({
          loading: false,
          type: 'error',
          message: data.message || 'Authentication failed. Please try again.',
          internetAccess: false
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        type: 'error',
        message: 'Unable to connect to the server. Please check your connection.',
        internetAccess: false
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              UniFi Hotspot Portal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Click below to connect to the network
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={authenticateUser}
              disabled={status.loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status.loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Authenticating...</span>
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-5 w-5" />
                  <span className="text-sm sm:text-base">Connect</span>
                </>
              )}
            </button>
            
            <StatusMessage 
              type={status.type} 
              message={status.message} 
              internetAccess={status.internetAccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;