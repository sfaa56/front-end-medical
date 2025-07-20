"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function BiddingSettingsPage() {
  const [enableBidding, setEnableBidding] = useState(true);
  const [maxOffers, setMaxOffers] = useState(3);
  const [offerExpiry, setOfferExpiry] = useState(48);
  const [showOfferPrices, setShowOfferPrices] = useState(true);

  const handleSave = () => {
    // Save logic here (API call, etc.)
    alert("Settings saved!");
  };

  return (
    <div className="mx-6 p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-10">Bidding System Settings</h1>

      {/* Enable Bidding System */}
      <div className="mb-5 flex items-center justify-between max-w-[430px]">
        <label className="font-medium text-gray-700">
          <input
            type="checkbox"
            checked={enableBidding}
            onChange={() => setEnableBidding((v) => !v)}
            className="mr-2 accent-secondary"
          />
          Enable Bidding System
        </label>
        <span className="text-xs text-gray-500">
          All new orders will be open for offers
        </span>
      </div>

      {/* Max Offers per Request */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">
          Max Offers per Request
        </label>
        <input
          type="number"
          min={1}
          value={maxOffers}
          onChange={(e) => setMaxOffers(Number(e.target.value))}
          className="border rounded px-3 py-2 w-32"
        />
        <span className="ml-2 text-xs text-gray-500">
          Each request is allowed only this number of offers
        </span>
      </div>

      {/* Offer Expiration Period */}
      <div className="mb-5">
        <label className="block font-medium text-gray-700 mb-1">
          Offer Expiration Period (hours)
        </label>
        <input
          type="number"
          min={1}
          value={offerExpiry}
          onChange={(e) => setOfferExpiry(Number(e.target.value))}
          className="border rounded px-3 py-2 w-32"
        />
        <span className="ml-2 text-xs text-gray-500">
          Any offer expires after this period (e.g. 48 hours)
        </span>
      </div>

      {/* Show Offer Prices */}
      <div className="mb-5 flex items-center">
        <label className="font-medium text-gray-700 mr-2">
          <input
            type="checkbox"
            checked={showOfferPrices}
            onChange={() => setShowOfferPrices((v) => !v)}
            className="mr-2 accent-secondary"
          />
          Show Offer Prices
        </label>
        <span className="text-xs text-gray-500">
          Show or hide offer prices for customers
        </span>
      </div>

      <Button
      variant={"submit"}
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition"
      >
        Save Settings
      </Button>
    </div>
  );
}