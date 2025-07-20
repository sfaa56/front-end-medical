"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function CMSSettings() {
  const [loading, setLoading] = useState(false);

  // Dummy data for local development
  const [settings, setSettings] = useState({
    emails: { info: "info@baittak.com", sales: "sales@baittak.com", agent: "agent@baittak.com" },
    socialMedia: { instagram: "https://instagram.com/baittak", facebook: "https://facebook.com/baittak", youtube: "https://youtube.com/baittak" },
    contact: { address: "123 Main St, City, Country", phone: "+1234567890" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, key] = name.split(".");
    setSettings((prev) => ({
      ...prev,
      [field]: { ...prev[field], [key]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Just show a toast or alert for demo
    alert("Settings updated (dummy)!");
  };

  return (
    <div className="Cms">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Contact</h2>

      {loading ? (
        <div className="flex items-center justify-center h-32">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Emails */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Emails</h3>
            {["info", "sales", "agent"].map((key) => (
              <Input
                key={key}
                type="email"
                name={`emails.${key}`}
                value={settings.emails[key]}
                onChange={handleChange}
                placeholder={`${key}@baittak.com`}
                className="mb-2"
              />
            ))}
          </div>

          {/* Social Media */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Social Media</h3>
            {["instagram", "facebook", "youtube"].map((key) => (
              <Input
                key={key}
                type="text"
                name={`socialMedia.${key}`}
                value={settings.socialMedia[key]}
                onChange={handleChange}
                placeholder={`Enter ${key} link`}
                className="mb-2"
              />
            ))}
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Contact Info</h3>
            <Input
              type="text"
              name="contact.address"
              value={settings.contact.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="mb-2"
            />
            <Input
              type="text"
              name="contact.phone"
              value={settings.contact.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mb-2"
            />
          </div>
          <button
            type="submit"
            className="saveSection"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}