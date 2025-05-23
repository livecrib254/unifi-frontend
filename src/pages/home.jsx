import React, { useState, useEffect, Fragment } from "react";
import { Wifi, WifiOff, Loader2, Globe, Clock, Database } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

const durationOptions = [
  { value: 10, label: "10 Minutes", description: "Quick access", price: 5 },
  { value: 20, label: "20 Minutes", description: "Short session", price: 10 },
  { value: 30, label: "30 Minutes", description: "Regular session", price: 15 },
  { value: 60, label: "1 Hour", description: "Extended access", price: 25 },
];

const dataOptions = [
  { value: 20, label: "20MB", description: "Light usage", price: 5 },
  { value: 50, label: "50MB", description: "Light usage", price: 5 },
  { value: 100, label: "100MB", description: "Light usage", price: 5 },
  { value: 250, label: "250MB", description: "Moderate browsing", price: 10 },
  { value: 500, label: "500MB", description: "Heavy usage", price: 20 },
  { value: 1000, label: "1GB", description: "Full access", price: 30 },
];

const StatusMessage = ({ type, message, internetAccess }) => {
  if (!message) return null;
  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className={`mt-4 p-4 rounded-lg border ${styles}`}>
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span>{message}</span>
      </div>
      {type === "success" && (
        <div className="mt-2 flex items-center gap-2 text-sm">
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
        className={`relative flex flex-col items-center justify-between rounded-lg border-2 p-4
          ${
            selected === option.value
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-50"
          }
          transition-all duration-200`}
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
        <Icon className="h-6 w-6 mb-2 text-blue-600" />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">{option.label}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            KES {option.price}
          </p>
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
      const duration = tab === "duration" ? selectedDuration : null;
      const dataBundle = tab === "data" ? selectedData : null;

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
          data : dataBundle,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (data.success) {
        setStatus({
          loading: false,
          type: "success",
          message: "Connected successfully! Redirecting...",
          internetAccess: data.internetAccess,
        });
        setTimeout(
          () => (window.location.href = "https://www.fedi.xyz/"),
          2000
        );
      } else {
        throw new Error(data.message || "Authentication failed");
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
    console.log(tab);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Hotspot Portal</h1>
            <p className="mt-2 text-lg text-gray-600">
              Choose your preferred package and pay via M-Pesa
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setTab("duration")}
              className={`px-4 py-2 rounded-md font-semibold ${
                tab === "duration"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Access Duration
            </button>
            <button
              onClick={() => setTab("data")}
              className={`px-4 py-2 rounded-md font-semibold ${
                tab === "data"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Data Bundles
            </button>
          </div>

          <div className="mt-6">
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

          <button
            onClick={() => setShowModal(true)}
            disabled={status.loading}
            className="mt-6 w-full h-12 flex items-center justify-center gap-2 rounded-lg text-white text-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Wifi className="h-5 w-5" />
            <span>Pay with M-Pesa</span>
          </button>

          <StatusMessage
            type={status.type}
            message={status.message}
            internetAccess={status.internetAccess}
          />
        </div>
      </div>

      {/* Modal */}
      <Transition show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClose={setShowModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-auto z-50">
              <Dialog.Title className="text-lg font-bold mb-2">
                Confirm Payment
              </Dialog.Title>
              <p className="text-sm text-gray-700 mb-1">
                Package: <strong>{selectedOption.label}</strong>
              </p>
              <p className="text-sm text-gray-700 mb-4">
                Cost: <strong>KES {selectedOption.price}</strong>
              </p>
              <input
                type="tel"
                placeholder="Enter M-Pesa phone number"
                className="w-full mb-4 border rounded-lg px-3 py-2"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={processingPayment}
              />
              <button
                onClick={initiatePayment}
                disabled={processingPayment || !phoneNumber}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </span>
                ) : (
                  "Confirm and Pay"
                )}
              </button>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Home;
