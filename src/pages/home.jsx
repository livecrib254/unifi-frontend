import React, { useState, useEffect, Fragment } from "react";
import { Wifi, WifiOff, Loader2, Globe, Clock, Database } from "lucide-react";
import { useStore } from "../store/store";


const durationOptions = [
  {
    value: 10,
    label: "10 Minutes",
    description: "Quick access",
    price: 5,
    expire_number: 10,
    expire_unit: 1, // 10 minutes
  },
  {
    value: 20,
    label: "20 Minutes",
    description: "Short session",
    price: 10,
    expire_number: 20,
    expire_unit: 1, // 20 minutes
  },
  {
    value: 30,
    label: "30 Minutes",
    description: "Regular session",
    price: 15,
    expire_number: 30,
    expire_unit: 1, // 30 minutes
  },
  {
    value: 60,
    label: "1 Hour",
    description: "Extended access",
    price: 25,
    expire_number: 60,
    expire_unit: 1, // 1 hour = 60 minutes
  },
  {
    value: 720,
    label: "12 Hours",
    description: "Half-day access",
    price: 50,
    expire_number: 720,
    expire_unit: 1, // 12 hours = 720 minutes
  },
  {
    value: 1440,
    label: "24 Hours",
    description: "Full-day access",
    price: 80,
    expire_number: 1440,
    expire_unit: 1, // 24 hours = 1440 minutes
  },
];

const dataOptions = [
  { value: 20, label: "20MB", description: "Light usage", price: 5 },
  { value: 50, label: "50MB", description: "Light usage", price: 5 },
  { value: 100, label: "100MB", description: "Light usage", price: 5 },
  { value: 250, label: "250MB", description: "Moderate browsing", price: 10 },
  { value: 500, label: "500MB", description: "Heavy usage", price: 20 },
  { value: 1000, label: "1GB", description: "Full access", price: 30 },
];

// Updated StatusMessage component
const StatusMessage = ({ type, message, internetAccess }) => {
  if (!message) return null;
  const styles =
    type === "error"
      ? "bg-red-500/20 border-red-400/50 text-red-200"
      : "bg-green-500/20 border-green-400/50 text-green-200";

  return (
    <div className={`mt-6 p-4 rounded-2xl border backdrop-blur-sm ${styles}`}>
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Wifi className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <WifiOff className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="font-medium">{message}</span>
      </div>
      {type === "success" && (
        <div className="mt-3 flex items-center gap-3 text-sm pl-11">
          <Globe className="h-4 w-4" />
          <span>
            Internet Access: {internetAccess ? "Available" : "Limited"}
          </span>
        </div>
      )}
    </div>
  );
};

const OptionSelector = ({
  options,
  selected,
  onChange,
  icon: Icon,
  disabled,
}) => (
  <div className="grid grid-cols-2 gap-4 pt-2">
    {options.map((option) => (
      <label
        key={option.value}
        className={`relative flex flex-col items-center justify-between rounded-2xl border-2 p-6 transition-all duration-300 transform hover:scale-105
          ${
            selected === option.value
              ? "border-purple-400 bg-gradient-to-br from-purple-500/20 to-blue-500/20 shadow-lg"
              : "border-white/20 bg-white/5 hover:bg-white/10"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="radio"
          name="option"
          value={option.value}
          checked={selected === option.value}
          onChange={() => onChange(option.value)}
          disabled={disabled}
          className="sr-only"
        />

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
            selected === option.value
              ? "bg-gradient-to-r from-purple-500 to-blue-600"
              : "bg-white/10"
          }`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        <div className="text-center">
          <h3 className="font-bold text-white text-lg">{option.label}</h3>
          <p className="text-sm text-white/70 mt-1">{option.description}</p>
          <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30">
            <p className="text-sm font-semibold text-green-300">
              KES {option.price}
            </p>
          </div>
        </div>

        {selected === option.value && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white"></div>
          </div>
        )}
      </label>
    ))}
  </div>
);

const Home = () => {
  const { updateActiveDuration, updateActiveDataplan, updateActiveTab } = useStore();
  const [status, setStatus] = useState({
    loading: false,
    type: null,
    message: "",
    internetAccess: false,
  });
  const [urlParams, setUrlParams] = useState(null);
  const [tab, setTab] = useState("duration");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedData, setSelectedData] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {
      ap: searchParams.get("ap"),
      id: searchParams.get("id"),
      t: searchParams.get("t"),
      url: searchParams.get("url"),
      ssid: searchParams.get("ssid"),
    };
    if (params.id) setUrlParams(params);
    else
      setStatus({
        type: "error",
        message: "No client MAC address found in URL.",
        internetAccess: false,
      });
  }, []);

  const authenticateUser = async () => {
    setStatus({
      loading: true,
      type: null,
      message: "Authenticating...",
      internetAccess: false,
    });

    try {
      let duration = null;
      let expire_number = null;
      let expire_unit = null;
      let data = null;

      if (tab === "duration") {
        duration = selectedDuration;
        const selected = durationOptions.find(
          (opt) => opt.value === selectedDuration
        );
        if (selected) {
          expire_number = selected.expire_number;
          expire_unit = selected.expire_unit;
        }
      }

      if (tab === "data") {
        data = selectedData; // just the data value, no expiry
      }

      const response = await fetch("/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientMac: urlParams.id,
          apMac: urlParams.ap,
          timestamp: urlParams.t,
          redirectUrl: urlParams.url,
          ssid: urlParams.ssid,
          duration,
          data,
          expire_number,
          expire_unit,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setStatus({
          loading: false,
          type: "success",
          message: "Connected successfully! Redirecting...",
          internetAccess: result.internetAccess,
        });
        setTimeout(() => {
          window.location.href = "https://www.fedi.xyz/";
        }, 2000);
      } else {
        throw new Error(result.message || "Authentication failed");
      }
    } catch (err) {
      setStatus({
        loading: false,
        type: "error",
        message: err.message || "Server error",
        internetAccess: false,
      });
    }
  };

  const selectedOption =
    tab === "duration"
      ? durationOptions.find((o) => o.value === selectedDuration)
      : dataOptions.find((o) => o.value === selectedData);

  const initiatePayment = async () => {
    setProcessingPayment(true);
    try {
      const response = await fetch("/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedOption.price,
          phoneNumber: phoneNumber,
          clientMac: "AA:BB:CC:DD:EE:F3",
          ...(tab === "duration"
            ? { duration: selectedDuration }
            : { data: selectedData }),
        }),
      });

      const result = await response.json();

      console.log(result);
      if (result.success) {
        setTimeout(() => {
          updateActiveTab(tab)
          updateActiveDataplan(selectedData)
          updateActiveDuration(selectedDuration)
          setShowModal(false);
          authenticateUser();
          setProcessingPayment(false);
        }, 3000);
      } else {
        throw new Error("Payment failed or canceled.");
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message, internetAccess: false });
      setShowModal(false);
    }
  };

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
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Header section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <Wifi className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Hotspot Portal
              </h1>
              <p className="mt-3 text-lg text-white/80">
                Choose your preferred package and pay via M-Pesa
              </p>
            </div>

            <StatusMessage
              type={status.type}
              message={status.message}
              internetAccess={status.internetAccess}
            />

            {/* Tab buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setTab("duration")}
                className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  tab === "duration"
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <Clock className="inline w-5 h-5 mr-2" />
                Access Duration
              </button>
              <button
                onClick={() => setTab("data")}
                className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  tab === "data"
                    ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <Database className="inline w-5 h-5 mr-2" />
                Data Bundles
              </button>
            </div>

            {/* Options grid */}
            <div className="mt-8">
              {tab === "duration" ? (
                <OptionSelector
                  options={durationOptions}
                  selected={selectedDuration}
                  onChange={setSelectedDuration}
                  icon={Clock}
                />
              ) : (
                <OptionSelector
                  options={dataOptions}
                  selected={selectedData}
                  onChange={setSelectedData}
                  icon={Database}
                />
              )}
            </div>

            {/* Pay button */}
            <button
              onClick={() => setShowModal(true)}
              disabled={status.loading}
              className="mt-8 w-full h-14 flex items-center justify-center gap-3 rounded-2xl text-white text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              <Wifi className="h-6 w-6" />
              <span>Pay with M-Pesa</span>
            </button>
          </div>
        </div>
      </div>

      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with enhanced blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm mx-auto z-50 border border-white/30 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-white/70 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              Confirm Payment
            </h2>

            <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
              <p className="text-sm text-white/80 mb-2">
                Package:{" "}
                <span className="font-semibold text-white">
                  {selectedOption.label}
                </span>
              </p>
              <p className="text-sm text-white/80">
                Cost:{" "}
                <span className="font-semibold text-green-300">
                  KES {selectedOption.price}
                </span>
              </p>
            </div>

            <input
              type="tel"
              placeholder="Enter M-Pesa phone number"
              className="w-full mb-6 border border-white/30 rounded-2xl px-4 py-3 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={processingPayment}
            />

            <button
              onClick={initiatePayment}
              disabled={processingPayment || !phoneNumber}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing Payment...
                </span>
              ) : (
                "Confirm and Pay"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
