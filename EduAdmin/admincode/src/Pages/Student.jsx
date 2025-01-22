
import { FiAlignLeft } from "react-icons/fi";

import AddStudentPopup from "../Popups/AddStudentPopup";
import { useState } from "react";

import { FaBars } from "react-icons/fa";

import StudentList from "../Components/StudentList";
import DigitalIdCards from "../Components/DigitalIdCards";
import Verification from "./Verification";


export default function Student() {


  const [Selected, setSelected] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  const selectedOutput = () => {
    switch (Selected) {
      case "Dashboard":
        return <AddStudentPopup/>;
      case "StudentList":
        return <StudentList />;
      case "Digital Id Requests":
        return <DigitalIdCards />;
      case "Account Verification Requests":
        return <Verification />;
    

      default:
        return <AddStudentPopup />;
    }
  }

  return (
    <div className="min-h-screen  bg-white w-screen m-6  overflow-hidden">
    
       <div className="flex justify-between items-center h-[70px] mb-5 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
                    <div className="flex items-center">
                      <FiAlignLeft size={30} color="orange" />
                      <h2 className="ml-4 text-2xl text-black font-bold">{Selected==="Dashboard"?"Student Dashboard":Selected +" Dashboard"}</h2>
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
                          ()=> setSelected("Dashboard")
                         }
                         className="flex w-full h-[50px]  shadow-sm mt-2 shadow-zinc-100 cursor-pointer hover:bg-yellow-50 px-3 items-center">
                          <p className="text-lg font-normal text-gray-800">Dashboard</p>
                          </div>
                        
                          <div
                          onClick={
                            () => setSelected("StudentList")
                          }
                          className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                          <p className="text-lg font-normal text-gray-800">StudentList</p>
                          </div>
                          <div
                          onClick={
                            () => setSelected("Digital Id Requests")
                          }
                          className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                          <p className="text-lg font-normal text-gray-800">Digital Id Requests</p>

                </div>
                <div
                onClick={
                  () => setSelected("Account Verification Requests")
                }
                className="flex w-full h-[50px] shadow-sm mt-2 shadow-zinc-100  cursor-pointer hover:bg-yellow-50 px-3 items-center">
                <p className="text-lg font-normal text-gray-800">Account Verification Requests</p>
                </div>
                
                         
                          </div>
                        )
                      }
                      
                  
                  </div>
   
      {selectedOutput()}
    
    </div>
  );

}
