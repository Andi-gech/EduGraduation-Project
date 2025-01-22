import React from 'react';
import { FiAlignLeft } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import UseFetchDepartment from '../../hooks/UseFechDepartment';
import UseFetchCafeSubscription from '../../hooks/UseFetchCafeSubscription';
import UseFetchUser from '../../hooks/UseFetchUser';
import UseFetchGateReport from '../../hooks/UseFechGateReport';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
} from "recharts";
import { Gauge , gaugeClasses} from '@mui/x-charts/Gauge';

export default function Dashboard() {
  const { data: subs } = UseFetchCafeSubscription();
  const { data: users } = UseFetchUser();
  const { data } = UseFetchDepartment();
  const { data: gatereport, isLoading, isError } = UseFetchGateReport();

  const pieChartData = [
    { name: 'Segment A', value: 60 },
    { name: 'Segment B', value: 40 },
  ];

  return (
    <div className="min-h-screen  bg-white w-full m-6 ">
   
      <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
        <div className="flex items-center">
          <FiAlignLeft size={30} color="orange" />
          <h2 className="ml-4 text-2xl text-black font-bold">Dashboard</h2>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 w-[400px] rounded-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ring-2 ring-zinc-300"
          />
          <button className="ml-4 p-2 rounded-full bg-blue-400 hover:bg-blue-600 transition">
            <FaBell size={20} />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Number Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Students"
          count={users?.data?.length}
          gradient="from-green-400 to-green-600"
        />
        <StatCard
          title="Total Subscriptions"
          count={subs?.data?.length}
          gradient="from-purple-400 to-purple-600"
        />
        <StatCard
          title="Total Departments"
          count={data?.data?.length}
          gradient="from-yellow-400 to-yellow-600"
        />
        <StatCard
          title="Total In Compound"
          count={gatereport?.data?.civilian}
          gradient="from-blue-400 to-blue-600"
        />
      </div>

    
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Total Student Number</h3>
      <div className="flex flex-wrap h-[200px] justify-between">
      
          <div className="p-4 bg-white rounded-xl shadow-lg">
          <AreaChart
              width={700}
              height={200}
              data={data?.data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="orange" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="orange" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="department" />
              <YAxis />
              <RechartTooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="orange"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </div>
          <div className=" bg-white w-[200px] h-[250px] rounded-xl shadow-lg flex items-center justify-center">
          <Gauge width={150} height={150}  sx={(theme) => ({
    [`& .${gaugeClasses.valueText}`]: {
      fontSize: 40,
      fontWeight: 'bold',
      fill: "white"
    },
    [`& .${gaugeClasses.valueArc}`]: {
      fill: 'orange',
    },
    [`& .${gaugeClasses.referenceArc}`]: {
      fill: theme.palette.text.disabled,
    },
  })} value={60} text={"60%"}  />

          </div>
        
        
      </div>
    </div>
  );
}

const StatCard = ({ title, count, gradient }) => {
  return (
    <div
      className={`p-6 bg-gradient-to-r ${gradient} text-white rounded-xl shadow-lg hover:scale-105 transform transition`}
    >
      <h4 className="text-3xl font-semibold mb-2">{count || 0}</h4>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
};
