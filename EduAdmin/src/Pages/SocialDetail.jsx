import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { RiTeamLine } from 'react-icons/ri'
import UseFetchclub from '../../hooks/UseFechClubs'
import { DataGrid } from '@mui/x-data-grid'
import { FiArrowLeft } from 'react-icons/fi'
import IsLoading from '../Components/IsLoading'



export default function SocialDetail() {
    const {id} = useParams()
  
      const { data: clubsData, isLoading: clubsLoading } = UseFetchclub();
      const club=clubsData?.data?.find((club)=>club._id===id);
      const navigate=useNavigate();
      
      const columns = [

        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'department', headerName: 'Department', width: 200 },
        { field: 'Year', headerName: 'Year', width: 100 },
        { field: 'semester', headerName: 'Semester', width: 100 },

   
        { field: 'gender', headerName: 'Gender', width: 200 },

        ];
    
        const rows=club?.clubMembers.map((member)=>({
          id:member._id,
          name:member.firstName + " " + member.lastName,
          department:member.Class.department,
            Year:member.Class.yearLevel,
            semester:member.Class.semister,
            gender:member.gender
        }))

  return (
   <div className="min-h-screen  bg-white w-full m-6 ">
        
           <div className="flex justify-between items-center h-[70px] mb-8 bg-gradient-to-r from-white to-white p-4 rounded-xl shadow-zinc-100 shadow-md text-white">
             <div className="flex items-center">
               <RiTeamLine size={30} color="orange" />
               <h2 className="ml-4 text-2xl text-black font-bold">{club?.clubname}</h2>
             </div>
             <div className='w-[50px] h-[50px] rounded-full shadow-sm shadow-zinc-200 cursor-pointer flex items-center justify-center'>
<FiArrowLeft size={30} onClick={()=>navigate(-1)} color='black' />
             </div>
           
           </div>

        <div className="w-[90%] mx-auto">
            {
               clubsLoading && <IsLoading />
            }
<DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
</div>
           </div>

  )
}
