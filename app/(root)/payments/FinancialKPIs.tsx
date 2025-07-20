import React from "react";
import {
  HiOutlineBanknotes,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { HiOutlineTrendingUp } from "react-icons/hi";

interface KPI {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
}

interface FinancialKPIsProps {
  kpis: KPI[];
}

// Map label keywords to icons
const getIconForLabel = (label: string) => {
  if (/payment/i.test(label)) return <HiOutlineBanknotes />;
  if (/earning/i.test(label)) return <HiOutlineCurrencyDollar />;
  if (/invoice/i.test(label)) return <HiOutlineDocumentText />;
  if (/pending|withdrawal/i.test(label)) return <HiOutlineClock />;
  if (/commiss/i.test(label)) return <HiOutlineChartBar />;
  return <HiOutlineTrendingUp />;
};

const FinancialKPIs: React.FC<FinancialKPIsProps> = ({ kpis }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    {kpis.map((kpi, idx) => (
      <div
        key={idx}
        className="flex items-center bg-white rounded-lg shadow border-l-4 border-secondary/80 p-4"
      >
        <div className="mr-3 text-secondary text-2xl">
          {/* Use icon from props or auto-select based on label */}
          {kpi.icon || getIconForLabel(kpi.label)}
        </div>
        <div>
          <div className=" text-gray-500 mb-1">{kpi.label}</div>
          <div className={`text-xl font-bold ${kpi.color || "text-black"}`}>
            {kpi.value}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FinancialKPIs;