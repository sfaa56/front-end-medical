"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

const NOTIF_PROVIDERS = [
  { value: "none", label: "None" },
  { value: "twilio", label: "Twilio" },
  { value: "firebase", label: "Firebase" },
];

function GeneralSettingsPage() {
  // Commission & Tax
  const [commission, setCommission] = useState(10);
  const [tax, setTax] = useState(5);
  const [applyTaxToProviders, setApplyTaxToProviders] = useState(true);

  // Payment Methods
  const [enableCreditCard, setEnableCreditCard] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(false);
  const [enableCash, setEnableCash] = useState(true);
  const [bankDetails, setBankDetails] = useState("");

  // Localization & Notifications
  const [defaultLang, setDefaultLang] = useState("en");
  const [userEmails, setUserEmails] = useState(true);
  const [providerEmails, setProviderEmails] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [notifProvider, setNotifProvider] = useState("none");

  // Tab state
  const [tab, setTab] = useState(0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved (dummy)!");
  };

  return (
    <div className=" mx-6 p-6 bg-white rounded-xl shadow border mt-8">
      <h1 className="text-2xl font-bold mb-6 text-secondary text-center">
        General Settings
      </h1>
      <div className="flex border-b mb-6">
        {[
          "Commission & Tax",
          "Payment Methods",
          "Localization & Notifications",
        ].map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              tab === i
                ? "border-secondary text-secondary"
                : "border-transparent text-gray-500 hover:text-secondary"
            }`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Commission & Tax */}
        {tab === 0 && (
          <div>
       
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Platform Commission (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Tax Rate (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <label className="font-medium">Apply Tax to Providers?</label>
              <input
                type="checkbox"
                checked={applyTaxToProviders}
                onChange={(e) => setApplyTaxToProviders(e.target.checked)}
                className="accent-secondary w-5 h-5"
              />
              <span>{applyTaxToProviders ? "Yes" : "No"}</span>
            </div>
            <button
              type="submit"
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90 transition"
            >
              Save
            </button>
          </div>
        )}

        {/* Payment Methods */}
        {tab === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Supported Payment Methods
            </h2>
            <div className="flex flex-col gap-4 mb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enableCreditCard}
                  onChange={(e) => setEnableCreditCard(e.target.checked)}
                  className="accent-secondary w-5 h-5"
                />
                Enable Credit Card
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="accent-secondary w-5 h-5"
                />
                Enable Bank Transfer
              </label>
              {enableBankTransfer && (
                <input
                  type="text"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  placeholder="Bank details"
                  className="w-full border rounded px-3 py-2 mt-2"
                />
              )}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enableCash}
                  onChange={(e) => setEnableCash(e.target.checked)}
                  className="accent-secondary w-5 h-5"
                />
                Enable Cash on Delivery
              </label>
            </div>
            <button
              type="submit"
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90 transition"
            >
              Save
            </button>
          </div>
        )}

        {/* Localization & Notifications */}
        {tab === 2 && (
          <div>
            <div className="flex  flex-col mb-4">
              <label className="font-medium text-gray-600 block mb-1">
                Default Language
              </label>

              <Select
                value={defaultLang}
                onValueChange={(value) => setDefaultLang(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={userEmails}
                onChange={(e) => setUserEmails(e.target.checked)}
                className="accent-secondary w-5 h-5"
              />
              <label>Enable user notification emails</label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={providerEmails}
                onChange={(e) => setProviderEmails(e.target.checked)}
                className="accent-secondary w-5 h-5"
              />
              <label>Enable provider notification emails</label>
            </div>
            <div className="mb-4">
              <label className="font-medium text-gray-600 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div className="flex  flex-col mb-4">
              <label className="font-medium text-gray-600 block mb-1">
                SMS / Push Notification Provider
              </label>

              <Select
                value={notifProvider}
                onValueChange={(value) => setNotifProvider(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                <SelectContent>
                  {NOTIF_PROVIDERS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              type="submit"
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90 transition"
            >
              Save
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default GeneralSettingsPage;
