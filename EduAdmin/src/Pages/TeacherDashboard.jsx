import React from 'react';
import { FiAlignLeft } from 'react-icons/fi';

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
import Api from '../utils/Api';
import { Gauge , gaugeClasses} from '@mui/x-charts/Gauge';
import { RiExportFill, RiInfoI, RiLogoutCircleRLine } from "react-icons/ri";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FaTachometerAlt,
  FaUser,
  FaArrowRight,
  FaBuilding,
  FaClipboardList,
  FaDoorOpen,
  FaBell,
  FaBook,
  FaUserPlus,
  FaUserCheck,
  FaUserTie,
  FaIdCard,


  FaCreditCard,
  FaDoorClosed,
  FaClipboardCheck,
  FaChartPie,
  FaMoneyBillWave,
  FaExclamationCircle,
  
  FaChalkboardTeacher,
  FaCheckCircle,
  FaUsers,
  FaRegCalendarAlt,
  FaExclamationTriangle,
  FaKey,
} from "react-icons/fa";
import UseFetchClasses from '../../hooks/UseFetchClasses';

export default function TeacherDashboard() {
  const { data: subs } = UseFetchCafeSubscription();
  const { data: users } = UseFetchUser();
  const { data } = UseFetchDepartment();
  const [open, setOpen] = React.useState(false);

  const { data: myclass, isLoading, isError } = UseFetchClasses()
 
  const navigate=useNavigate()
  const signOut = useSignOut()
  const {
    data: notifications,
    isLoading:isloadings,
    
  } = useQuery(["notifications"], async () => {
    const response = await Api.get("/Notification/all");
    return response.data;
  },
  {
    refetchInterval: 1000
  });
  


  return (
    <div className="min-h-screen  bg-white w-full m-6 ">
   
      <div className="flex relative justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
     
        <div className="flex items-center">
          <FiAlignLeft size={30} color="orange" />
          <h2 className="ml-4 text-2xl text-black font-bold">Dashboard</h2>
        </div>
        <div className="flex items-center">
        

          <button onClick={()=>{
            setOpen(!open)
          }} className="ml-4 p-2 relative rounded-full bg-blue-400 hover:bg-blue-600 transition">
            <FaBell size={20} />
            {
              notifications?.length>0 && <div className='px-[6px] py-[2px]  flex items-center justify-center bg-red-400 rounded-full absolute -top-[1px] -right-[10px]'>
              <p className='text-white text-[10px]'>{notifications?.length}</p>
            </div>
            }
            
          </button>
          <button onClick={()=>{
          signOut()
          navigate('/login')

          }} className="ml-4 p-2 relative rounded-full bg-white shadow-zinc-200 shadow-sm hover:bg-zinc-50 transition">
            
            <RiLogoutCircleRLine size={20} color='black' />
            
          </button>
        </div>
        {
          open && <div className=" absolute top-[75px] right-0 flex flex-col items-center shadow-sm shadow-zinc-400 rounded-md z-50 bg-white w-[400px] h-[250px] overflow-y-auto">
         {
          notifications?.map((notification)=>(
            <div className='w-[90%] shrink-0 mt-3 rounded-md h-[60px] flex flex-row items-center px-2 bg-white shadow-sm'>
<div className='w-[40px] h-[40px] bg-blue-400 rounded-full flex items-center justify-center'>
  <FaBell size={20} color="white"/>
  </div>
  <p className=' text-black  ml-2'>{notification?.notification}</p>
          </div>
          ))
         }
     
         {
            notifications?.length===0 && <p className='text-gray-500 text-center mt-3'>No notifications available</p>
         }
          
        </div>
        }
        
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Number Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          title="Class Assigned"
          count={myclass?.data?.length}
          gradient="from-green-400 to-green-600"
        />
        <StatCard
          title="Uncompleted Assignment"
          count={subs?.data?.length}
          gradient="from-purple-400 to-purple-600"
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
      className={`p-6 bg-gradient-to-r ${gradient} w-[400px]  text-white rounded-xl shadow-lg hover:scale-105 transform transition`}
    >
      <h4 className="text-3xl font-semibold mb-2">{count || 0}</h4>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
};
