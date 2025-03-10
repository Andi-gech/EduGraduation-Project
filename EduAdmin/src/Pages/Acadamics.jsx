
import { HiOutlineAcademicCap } from "react-icons/hi";

import { useState } from "react";
import AcadamicClass from "../Components/AcadamicClass";
import { GoGear } from "react-icons/go";
import { useMutation } from "@tanstack/react-query";
import Api from "../utils/Api";


export default function Academics() {
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [alertpopup, setAlertpopup] = useState(false);
  const [open, setOpen] = useState(false);
  const mutation =useMutation(
    {
      mutationFn: async () => {
        const response = await Api.post("/promotion/promote");
        return response.data;
      },
      onError: (error) => {
        console.log(error);
        setError("Error promoting users");
        setTimeout(() => {
          setError(false);
        }, 3000);
      },
      mutationKey: "initiateSemister",
      onSuccess: (data) => {
        setSucess("All classes have been promoted to new semister");
        setTimeout(() => {
          setSucess(false);
        }, 3000);

    }
  }
  )
  
  

  return (
<div className="min-h-screen  bg-white w-screen m-6  ">
    
 <div className="flex justify-between items-center h-[70px] mb-5 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
              <div className="flex items-center">
                <HiOutlineAcademicCap size={30} color="orange" />
                <h2 className="ml-4 text-2xl text-black font-bold">Acadamics Board</h2>
              </div>
               <div className="flex  flex-row items-center ">
                <button onClick={
                  ()=>setOpen(!open)
                } className="ml-4 p-2 rounded-full shadow-sm shadow-zinc-100 hover:shadow-zinc-200 transition">
                  <GoGear size={20} color="black" />
                </button>
               
                {open && <div className="absolute top-[75px] right-[40px] flex flex-col items-center shadow-sm shadow-zinc-400 rounded-md z-50 bg-white w-[400px] h-[250px] overflow-y-auto">
                  <p className="text-black text-lg font-bold mt-4">Settings</p>
                  <p className=" text-[13px] text-orange-600 text-center  font-normal mt-4">Note that this will promote all classes to new acadamic semister</p>
                 {
                    sucess && <p className="text-green-500">{sucess}</p>
                  }
                  {
                    error && <p className="text-red-500">{error}</p>
                 }
                 {mutation.isLoading && <p className="text-black">Loading...</p>}
                  <button onClick={
                    ()=>{
                     setAlertpopup(true)
                     setOpen(false)
                    }
                  } className=" p-4 shadow-sm mt-5  rounded-md shadow-zinc-500" >
                    <p className="text-black">Initiate New Semister</p>
                  </button>
                  </div>}
                </div>
              
                
            
            </div>
            <AcadamicClass/>


  

     {
        alertpopup && 
        <div className="absolute top-[0] left-[0] w-full h-full bg-black bg-opacity-50 z-40">
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-8  shadow-sm shadow-zinc-400 rounded-md z-50">
          <p className="text-black text-lg font-bold">Are you sure you want to initiate new semister?</p>
          <p className="text-[13px] text-orange-600 text-center  font-normal mt-4">Note that this will promote all classes to new acadamic semister</p>
          <div className="flex flex-row justify-between items-center mt-4">
            <button onClick={()=>{
              setAlertpopup(false)
            }} className="p-2 rounded-md bg-red-700 text-white">No</button>
            <button onClick={()=>{
              setAlertpopup(false)
              mutation.mutate()
            }} className="p-2 rounded-md bg-green-300 text-white">Yes</button>
          </div>
        </div>
      </div>
     }
    </div>
  );
}
