import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlignLeft } from "react-icons/fi";

import UseFetchClasses from "../../hooks/UseFetchClasses";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import AcadamicClass from "../Components/AcadamicClass";


export default function Academics() {


  const [Selected, setSelected] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  return (
<div className="min-h-screen  bg-white w-screen m-6  ">
    
 <div className="flex justify-between items-center h-[70px] mb-5 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
              <div className="flex items-center">
                <FiAlignLeft size={30} color="orange" />
                <h2 className="ml-4 text-2xl text-black font-bold">{Selected==="Dashboard"?"Cafe Dashboard":Selected +" Dashboard"}</h2>
              </div>
               
                <button onClick={
                  () => setOpen(!open)
                } className="ml-4 p-2 rounded-full shadow-sm shadow-zinc-100 hover:shadow-zinc-200 transition">
                  <FaBars size={20} color="black" />
                </button>
                {
                  open && (
                    <div className="absolute flex w-[300px] py-[10px]  flex-col z-40 top-[90px] right-[20px] bg-white shadow-md  rounded-md ">
                   <div
                   onClick={
                    ()=> setSelected("AcadamicClass")
                   }
                   className="flex w-full h-[50px]  shadow-sm mt-2 shadow-zinc-100 cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">Acadamics Class</p>
                    </div>
                  
                    <div
                    onClick={
                      () => setSelected("CafeSubscription")
                    }
                    className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">CafeSubscription</p>
                    </div>
                    <div
                    onClick={
                      () => setSelected("Transactions")
                    }
                    className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">Transactions</p>
                    </div>
                    <div
                    onClick={
                      ()=>setSelected("CafeGate")
                    } className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">CafeGate</p>
                    </div>
                    <div onClick={
                      ()=>setSelected("Add Students")
                    } className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">Add Students</p>
                    </div>
                    <div onClick={
                      ()=>setSelected("CafeRule")
                    } className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                    <p className="text-lg font-normal text-gray-800">CafeRule</p>

                    </div>
                    </div>
                  )
                }
                
            
            </div>
            <AcadamicClass/>


  

     
    </div>
  );
}
