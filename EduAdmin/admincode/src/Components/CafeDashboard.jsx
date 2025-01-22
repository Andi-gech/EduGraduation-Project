import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function CafeDashboard() {
  // Dummy Data for the Graph
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Labels for the months
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1200, 1500, 1800, 1300, 1600, 1900, 2100], // Dummy revenue data
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area fill color
        fill: true,
        tension: 0.3, // Curvature of the line
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
      },
    ],
  }

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false, // Hide the title
      },
      legend: {
        display: false, // Hide the legend
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff', // X-axis label color
        },
      },
      y: {
        ticks: {
          color: '#fff', // Y-axis label color
        },
      },
    },
  }

  return (
    <div className="w-full  flex justify-center items-center">
      <div className="bg-white rounded-3xl p-10  max-w-6xl w-full flex"> {/* Flex container for side by side layout */}
        

        <div className="w-2/3 pr-8"> 
      

          <div className="graph-container mb-8 rounded-lg overflow-hidden ">
            <Line data={data} options={options} />
            <p className="text-center text-gray-500 mt-2">Revenue in $</p>
          </div>
        </div>

       
        <div className="w-1/3 flex flex-col justify-between"> {/* Cards take 1/3 of the width */}
    
          <div className="mb-6">
            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition duration-300 ease-in-out mb-4">
              <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">$10,500</p>
            </div>
            <div className="bg-green-600 text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition duration-300 ease-in-out mb-4">
              <h3 className="text-xl font-semibold mb-2">Total Customers</h3>
              <p className="text-3xl font-bold">1,250</p>
            </div>
            <div className="bg-yellow-600 text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-2">Average Rating</h3>
              <p className="text-3xl font-bold">4.8</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
