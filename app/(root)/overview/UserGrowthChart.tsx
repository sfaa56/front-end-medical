"use client"
import React from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




const UserGrowthChart = () => {
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'User Growth',
      data: [100, 200, 300, 400, 500],
      fill: false,
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'rgba(59, 130, 246, 0.2)',
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
      <h2 className="text-lg font-semibold mb-2">User Growth</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserGrowthChart;
