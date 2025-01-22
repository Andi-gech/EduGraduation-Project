import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import UseFetchTransactionReport from '../../hooks/UseFechTransactionReport'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function CafeDashboard() {
  const { data: report, isLoading } = UseFetchTransactionReport()

  // Parse report data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const totalsByMonth = report?.data?.totalsByMonth || {}
  const thisMonthTotal = report?.data?.thisMonthTotal || 0
  const thisMonthCustomerTotal = report?.data?.thisMonthCustomerTotal || 0

  // Prepare data for the Line chart
  const chartData = {
    labels: months, // X-axis labels
    datasets: [
      {
        label: 'Revenue ($)',
        data: months.map((month) => totalsByMonth[month] || 0), // Populate revenue data
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area fill color
        fill: true,
        tension: 0.3, // Curvature of the line
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Point color
      },
    ],
  }

  // Options for the chart
  const chartOptions = {
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
          color: '#fff', 
        },
      },
    },
  }

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-white  flex-row items-center justify-center rounded-3xl p-10 max-w-6xl w-full flex"> {/* Flex container for side by side layout */}
        
        <div className="   w-full pr-8">
         
          <div className="graph-container mb-8 rounded-lg overflow-hidden">
            <Line data={chartData} options={chartOptions} />
            <p className="text-center text-gray-500 mt-2">Revenue in $</p>
          </div>
        </div>

        <div className="w-1/3 flex flex-col justify-between">
         
          <div className="mb-6">
            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition duration-300 ease-in-out mb-4">
              <h3 className="text-xl font-semibold mb-2">Total Revenue This Month</h3>
              <p className="text-3xl font-bold">${thisMonthTotal}</p>
            </div>
            <div className="bg-green-600 text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition duration-300 ease-in-out mb-4">
              <h3 className="text-xl font-semibold mb-2">Total Customers This Month</h3>
              <p className="text-3xl font-bold">{thisMonthCustomerTotal}</p>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  )
}
