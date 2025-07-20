"use client";
import React, { useState } from "react";
import {
  BarChart2,
  Users,
  Briefcase,
  Star,
  HeartPulse,
  Calendar,
  Download,
  PieChart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend as ReLegend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// Dummy Data
const dummyStats = {
  totalRequests: 5200,
  completedRequests: 4600,
  canceledRequests: 400,
  monthlyRevenue: 12300,
  activeProviders: 320,
  avgRating: 4.6,
  engagement: [30, 45, 60, 80, 70, 90, 100],
  providerActivity: [10, 20, 40, 35, 50, 60, 55],
  serviceQuality: [4.2, 4.4, 4.5, 4.6, 4.7, 4.5, 4.6],
  requestsOverTime: [700, 800, 900, 850, 950, 1000, 1000],
  revenuePerMonth: [1500, 1700, 1800, 1600, 2000, 1900, 1800],
  topProviders: [
    { name: "Provider A", total: 320, completion: 98, avgRating: 4.9 },
    { name: "Provider B", total: 290, completion: 95, avgRating: 4.7 },
    { name: "Provider C", total: 250, completion: 92, avgRating: 4.8 },
    { name: "Provider D", total: 210, completion: 90, avgRating: 4.6 },
  ],
  canceledSummary: [
    {
      id: "REQ-1001",
      client: "Ali",
      provider: "Provider A",
      reason: "Client canceled",
      date: "2024-06-01",
    },
    {
      id: "REQ-1002",
      client: "Sara",
      provider: "Provider B",
      reason: "Provider unavailable",
      date: "2024-06-02",
    },
    {
      id: "REQ-1003",
      client: "John",
      provider: "Provider C",
      reason: "Duplicate request",
      date: "2024-06-03",
    },
  ],
  requestsPerCategory: [
    { category: "Cleaning", value: 2200 },
    { category: "Plumbing", value: 1200 },
    { category: "Electrical", value: 900 },
    { category: "Painting", value: 900 },
  ],
};

const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const regions = ["All", "Riyadh", "Jeddah", "Dammam"];
const categories = ["All", "Cleaning", "Plumbing", "Electrical", "Painting"];
const providers = ["All", ...dummyStats.topProviders.map((p) => p.name)];
const pieColors = ["#6D28D9", "#059669", "#F59E42", "#F43F5E"];

function AnalyticsPage() {
  // Filters
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [provider, setProvider] = useState("");

  
  // Filtered provider logic
  const filteredProvider =
    provider.trim() !== ""
      ? dummyStats.topProviders.find(
          (p) => p.name.toLowerCase().includes(provider.trim().toLowerCase())
        )
      : null;

       // Filtered data for charts and tables
  const filteredTopProviders =
    filteredProvider != null ? [filteredProvider] : dummyStats.topProviders;



  // Dummy export handlers
  const handleExport = (type: "pdf" | "excel") => {
    alert(`Exporting data to ${type.toUpperCase()} (dummy)!`);
  };

  // Prepare data for Recharts
  const requestsPerCategory = dummyStats.requestsPerCategory;
  const requestsOverTime = chartLabels.map((label, i) => ({
    month: label,
    requests: dummyStats.requestsOverTime[i],
  }));
  const revenuePerMonth = chartLabels.map((label, i) => ({
    month: label,
    revenue: dummyStats.revenuePerMonth[i],
  }));
  const cancelRate = Math.round(
    (dummyStats.canceledRequests / dummyStats.totalRequests) * 100
  );

  return (
    <div className="mx-6 mb-10">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <BarChart2 className="w-7 h-7" /> Reports & Analytics
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((r) => ({ ...r, from: e.target.value }))
              }
              className="border rounded px-2 py-1 text-sm"
            />
            <span className="mx-1 text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((r) => ({ ...r, to: e.target.value }))
              }
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          {/* Region */}
          <div className="flex items-center gap-2 ">
            <Select value={region} onValueChange={(value) => setRegion(value)}>
              <SelectTrigger className="gap-6 rounded-sm h-8">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Category */}
          <div className="flex items-center gap-2 ">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger className="gap-6 rounded-sm h-8">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Provider */}
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              <FiSearch />
            </span>
            <Input
              placeholder="Search Provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="pl-10 h-8 rounded-sm"
            />
          </div>
          {/* Export Buttons */}
          <button
            className="flex items-center gap-2 border border-gray-400 text-gray-900 px-3 py-1 rounded hover:bg-gray-200 transition text-sm"
            onClick={() => handleExport("pdf")}
            type="button"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            className="flex items-center gap-2 border border-gray-400 text-gray-900 px-3 py-1 rounded hover:bg-green-700 transition text-sm"
            onClick={() => handleExport("excel")}
            type="button"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <MetricCard
          label="Total Requests"
          value={dummyStats.totalRequests}
          icon={<TrendingUp className="text-secondary" />}
        />
        <MetricCard
          label="Completed Requests"
          value={dummyStats.completedRequests}
          icon={<TrendingUp className="text-green-600" />}
        />
        <MetricCard
          label="Canceled Requests"
          value={dummyStats.canceledRequests}
          icon={<TrendingDown className="text-red-500" />}
        />
        <MetricCard
          label="Monthly Revenue"
          value={`$${dummyStats.monthlyRevenue.toLocaleString()}`}
          icon={<BarChart2 className="text-secondary" />}
        />
        <MetricCard
          label="Active Providers"
          value={dummyStats.activeProviders}
          icon={<Briefcase className="text-secondary" />}
        />
        <MetricCard
          label="Average Rating"
          value={dummyStats.avgRating}
          icon={<Star className="text-yellow-400" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Requests Over Time (Line Chart) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-secondary" /> Requests Over Time
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ReTooltip />
              <Line type="monotone" dataKey="requests" stroke="#6D28D9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Revenue Per Month (Bar Chart) */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-green-600" /> Revenue Per Month
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenuePerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ReTooltip />
              <Bar dataKey="revenue" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top Providers by Completed Requests (Horizontal Bar) */}
            <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" /> Top Providers by Completed Requests
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={filteredTopProviders}
              layout="vertical"
              margin={{ left: 40, right: 20, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              {/* Remove tooltip if you want static */}
              <Bar dataKey="total" fill="#6D28D9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie/Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Requests per Category (Pie Chart) */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center ">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-secondary" /> Requests per Category
          </h2>
      <ResponsiveContainer width={420}>
  <RePieChart>
    <Pie
      data={requestsPerCategory}
      dataKey="value"
      nameKey="category"
      label={({ name, value }) => `${name}: ${value}`}
      outerRadius={80}
    >
      {requestsPerCategory.map((entry, i) => (
        <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
      ))}
    </Pie>
  

  </RePieChart>
</ResponsiveContainer>
        </div>
        {/* Cancellation Rate (Donut Chart) */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-red-500" /> Cancellation Rate
          </h2>
          <ResponsiveContainer width={220} height={220}>
            <RePieChart>
              <Pie
                data={[
                  { name: "Canceled", value: cancelRate },
                  { name: "Completed", value: 100 - cancelRate },
                ]}
                dataKey="value"
                nameKey="name"
                label
              >
                <Cell fill="#F43F5E" />
                <Cell fill="#059669" />
              </Pie>
              <ReTooltip />
              <ReLegend />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-gray-600 text-sm">
            {cancelRate}% canceled, {100 - cancelRate}% completed
          </div>
        </div>
      </div>

      {/* Tables */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Top Providers Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Top-performing Providers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/10 text-secondary">
                  <th className="p-2 text-left">Provider Name</th>
                  <th className="p-2 text-center">Total Requests</th>
                  <th className="p-2 text-center">Completion Rate</th>
                  <th className="p-2 text-center">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopProviders.map((p) => (
                  <tr key={p.name} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-center">{p.total}</td>
                    <td className="p-2 text-center">{p.completion}%</td>
                    <td className="p-2 text-center">{p.avgRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Cancelled Requests Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Cancelled Requests Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-50 text-red-500">
                  <th className="p-2 text-left">Request ID</th>
                  <th className="p-2 text-left">Client</th>
                  <th className="p-2 text-left">Provider</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyStats.canceledSummary
                  .filter((r) =>
                    filteredProvider
                      ? r.provider.toLowerCase() === filteredProvider.name.toLowerCase()
                      : true
                  )
                  .map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{r.id}</td>
                      <td className="p-2">{r.client}</td>
                      <td className="p-2">{r.provider}</td>
                      <td className="p-2">{r.reason}</td>
                      <td className="p-2">{r.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card
function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
      <div className="mb-2">{icon}</div>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

export default AnalyticsPage;