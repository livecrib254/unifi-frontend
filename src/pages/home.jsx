import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, Globe, Clock } from 'lucide-react';

const durationOptions = [
  { value: 10, label: '10 Minutes', description: 'Quick access' },
  { value: 20, label: '20 Minutes', description: 'Short session' },
  { value: 30, label: '30 Minutes', description: 'Regular session' },
  { value: 60, label: '1 Hour', description: 'Extended access' },
  { value: 720, label: '12 Hours', description: 'Half day access' },
  { value: 1440, label: '24 Hours', description: 'Full day access' },
];

const StatusMessage = ({ type, message, internetAccess }) => {
  if (!message) return null;
  
  const styles = type === 'error' 
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-green-50 border-green-200 text-green-700';
  
  return (
    <div className={`mt-4 p-4 rounded-lg border ${styles}`}>
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


const DurationSelector = ({ selected, onChange, disabled }) => (
  <div className="grid grid-cols-2 gap-4 pt-2">
    {durationOptions.map((option) => (
      <label
        key={option.value}
        className={`
          relative flex flex-col items-center justify-between rounded-lg border-2 p-4
          ${selected === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
          transition-all duration-200
        `}
      >
        <input
          type="radio"
          name="duration"
          value={option.value}
          checked={selected === option.value}
          onChange={() => onChange(option.value)}
          disabled={disabled}
          className="sr-only"
        />
        <Clock className="h-6 w-6 mb-2 text-blue-600" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">{option.label}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </div>
        {selected === option.value && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-500" />
        )}
      </label>
    ))}
  </div>
);

const Home = () => {
  const [status, setStatus] = useState({
    loading: false,
    type: null,
    message: '',
    internetAccess: false
  });
  const [urlParams, setUrlParams] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(10);

  useEffect(() => {
    // Parse URL parameters when component mounts
    const searchParams = new URLSearchParams(window.location.search);
    const params = {
      ap: searchParams.get('ap'),
      id: searchParams.get('id'),
      t: searchParams.get('t'),
      url: searchParams.get('url'),
      ssid: searchParams.get('ssid')
    };
    
    if (params.id) {
      setUrlParams(params);
      console.log('Client MAC found:', params.id);
    } else {
      setStatus({
        type: 'error',
        message: 'No client MAC address found in URL. Please check your connection.',
        internetAccess: false
      });
      console.log('No client MAC found in URL parameters');
    }
  }, []);

  const authenticateUser = async () => {
    if (!urlParams?.id) {
      setStatus({
        type: 'error',
        message: 'Client MAC address not found. Please check your connection.',
        internetAccess: false
      });
      return;
    }

    setStatus({ 
      loading: true, 
      type: null, 
      message: 'Connecting to network...', 
      internetAccess: false 
    });

    try {
      console.log('Authenticating with duration:', selectedDuration, 'minutes');
      
      const response = await fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientMac: urlParams.id,
          apMac: urlParams.ap,
          timestamp: urlParams.t,
          redirectUrl: urlParams.url,
          ssid: urlParams.ssid,
          duration: selectedDuration
        })
      });

      const data = await response.json();
      console.log('Authentication response:', data);
      
      if (!response.ok) {
        let errorMessage = 'Authentication failed. Please try again.';
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
          message: `Connected successfully for ${selectedDuration} minutes! MAC: ${urlParams.id}`,
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
      console.error('Authentication error:', error);
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
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Designing Africa's Hotspot Portal
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Select your preferred duration and connect to the network
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Access Duration</h3>
              <DurationSelector
                selected={selectedDuration}
                onChange={setSelectedDuration}
                disabled={status.loading}
              />
            </div>
            
            <button
              onClick={authenticateUser}
              disabled={status.loading}
              className={`
                w-full h-12 flex items-center justify-center gap-2 
                rounded-lg text-white text-lg font-medium
                ${status.loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}
                transition-colors duration-200
              `}
            >
              {status.loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Wifi className="h-5 w-5" />
                  <span>Connect for {selectedDuration} minutes</span>
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