"use client"
import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // <-- Add this
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // <-- Add this
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const OrderGrowthChart = () => {
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Completed Orders',
      data: [50, 100, 150, 200, 250],
      backgroundColor: 'rgb(16, 185, 129)', // Green
    },
    {
      label: 'Cancelled Orders',
      data: [5, 10, 15, 20, 25],
      backgroundColor: 'rgb(239, 68, 68)', // Red
    },
    {
      label: 'Orders In Progress',
      data: [10, 20, 30, 40, 50],
      backgroundColor: 'rgb(245, 158, 11)', // Orange
    },
  ],
};


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Order Growth</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default OrderGrowthChart;
