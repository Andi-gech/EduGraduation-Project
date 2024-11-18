/* eslint-disable react/prop-types */
import { FiAlignLeft } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { PieChart } from "@mui/x-charts/PieChart";
import UseFetchDepartment from "../../hooks/UseFechDepartment";
import UseFetchCafeSubscription from "../../hooks/UseFetchCafeSubscription";
import UseFetchUser from "../../hooks/UseFetchUser";

export default function Dashboard() {
  const { data: subs } = UseFetchCafeSubscription();
  const { data: users } = UseFetchUser();
  const { data } = UseFetchDepartment();

  const pichartdata =
    data?.data?.map((item) => ({
      name: item?.department,
      value: item?.count || 0,
    })) || [];

  return (
    <div className="w-[80%] bg-white flex flex-col  my-[15px]">
      <div className="text-[20px] w-full h-[50px] flex flex-row font-bold text-black p-3">
        <div className="flex flex-row w-full items-center">
          <FiAlignLeft size={30} className="text-[26px] font-bold text-black" />
          <p className="font-bold text-black mx-3">Dashboard</p>
        </div>
        <div className="flex flex-row items-center justify-center">
          <input
            className="p-2 border-0 outline-none text-sm w-[300px] h-[40px] rounded-full bg-zinc-50 text-black shadow-sm focus:ring-0 focus:outline-none transition duration-300"
            placeholder="Search..."
          />
          <div className="mx-4">
            <FaBell size={20} className="text-[20px] font-bold text-black" />
          </div>
        </div>
      </div>

      <div className="flex h-[230px] w-full flex-col">
        <div className="flex flex-row my-2">
          <p className="text-gray-900 text-[18px]">Number Statics</p>
        </div>
        <div className="flex flex-row items-center">
          <StatCard title="Total Students" count={users?.data?.length} />
          <StatCard title="Total Subscriptions" count={subs?.data?.length} />
          <StatCard title="Total Departments" count={data?.data?.length} />
          <StatCard
            title="Total Incomponund Students"
            count={users?.data?.filter((user) => user?.incomponund)?.length}
          />
        </div>
      </div>

      <div className="flex flex-row my-2">
        <p className="text-[18px] text-gray-900">Graph Representation</p>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex w-fit flex-row px-[10px] rounded-md bg-white items-center border-zinc-200 border-[1px]">
          <AreaChart
            width={750}
            height={200}
            data={data?.data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </div>
        <div className="flex w-[200px] h-[200px] flex-row px-[10px] rounded-none items-center border-zinc-200 border-[1px] mx-2">
          <PieChart
            series={[
              {
                data: pichartdata,
                innerRadius: 30,
                outerRadius: 70,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 90,
                cy: 90,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, count }) => {
  return (
    <div className="w-[250px] h-[180px] mx-4 text-center flex flex-col items-center justify-center rounded-md shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="w-full h-full bg-gradient-to-r from-zinc-100 to-zinc-100 rounded-md flex flex-col items-center justify-center">
        <p className="font-bold text-black text-[40px]">{count || 0}</p>
        <p className="text-[20px] font-bold text-black">{title}</p>
      </div>
    </div>
  );
};
