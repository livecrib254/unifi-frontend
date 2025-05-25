import React, { useState, useEffect } from "react";
import {
  Wifi,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  Clock,
  Database,
  ExternalLink,
} from "lucide-react";
import { useStore } from "../store/store";

export default function WifiSuccessPage() {
  const { activeDuration, activeDataPlan, activeTab } = useStore();
  const [isConnected, setIsConnected] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    // Get session info from URL params or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const sessionData = {
      package: urlParams.get("package") || "Premium Access",
      duration: urlParams.get("duration") || "60 minutes",
      data: urlParams.get("data") || "Unlimited",
      network: urlParams.get("ssid") || "Design WIFI",
    };
    setSessionInfo(sessionData);

    // Animate connection success
    const timer1 = setTimeout(() => setIsConnected(true), 500);
    const timer2 = setTimeout(() => setShowFeatures(true), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleStartBrowsing = () => {
    window.open("https://www.google.com/", "_blank");
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Connection",
      description:
        "Your connection is protected with enterprise-grade security",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "High-Speed Internet",
      description: "Enjoy blazing fast speeds for all your browsing needs",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Access",
      description: "Access websites and services from around the world",
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-scroll">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* Main success card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl text-center transform hover:scale-105 transition-all duration-500">
            {/* WiFi Icon with pulse animation */}
            <div className="relative mb-6">
              <div
                className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center transform transition-all duration-1000 ${
                  isConnected ? "scale-100 rotate-0" : "scale-50 rotate-180"
                }`}
              >
                <Wifi className="w-12 h-12 text-white" />
              </div>

              {/* Success checkmark overlay */}
              <div
                className={`absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                  isConnected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </div>

              {/* Pulse rings */}
              <div
                className={`absolute inset-0 rounded-full border-4 border-green-400/50 animate-ping ${
                  isConnected ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full border-4 border-green-400/30 animate-ping delay-200 ${
                  isConnected ? "opacity-100" : "opacity-0"
                }`}
              ></div>
            </div>

            {/* Success message */}
            <div
              className={`transform transition-all duration-1000 ${
                isConnected
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Connected Successfully!
              </h1>
              <p className="text-white/80 text-lg mb-6">
                You're now connected to our secure WiFi network
              </p>
            </div>

            {/* Connection details */}
            <div
              className={`bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 transform transition-all duration-1000 delay-300 ${
                isConnected
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-white/60">Network</span>
                <span className="text-white font-medium">
                  {sessionInfo?.network}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-white/60">Package</span>
                <span className="text-white font-medium">
                  {activeTab === "duration" ? "Timed Session" : "Data Bundle"}
                </span>
              </div>
              {sessionInfo?.duration !== "Unlimited" && (
                <div className="flex justify-between items-center text-sm mb-2">
                  {activeTab === "duration" ? (
                    <span className="text-white/60 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Duration
                    </span>
                  ) : (
                    <span className="text-white/60 flex items-center">
                      <Database className="w-3 h-3 mr-1" />
                      Bundle
                    </span>
                  )}

                  <span className="text-white font-medium">
                    {activeTab === "duration" ? activeDuration : activeDataPlan}
                  </span>
                </div>
              )}
              {sessionInfo?.data !== "Unlimited" && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-white/60 flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Data
                  </span>
                  <span className="text-white font-medium">
                    {sessionInfo?.data}MB
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Status</span>
                <span className="text-green-400 font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active
                </span>
              </div>
            </div>

            {/* Start browsing button */}
            <button
              onClick={handleStartBrowsing}
              className={`w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 ${
                isConnected
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <ExternalLink className="w-5 h-5" />
              Start Browsing
            </button>
          </div>

          {/* Feature cards */}
          <div
            className={`mt-8 space-y-4 transform transition-all duration-1000 delay-700 ${
              showFeatures
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer message */}
          <div
            className={`text-center mt-8 transform transition-all duration-1000 delay-1000 ${
              showFeatures
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <p className="text-white/50 text-sm">
              Enjoy your browsing experience! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
