import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import SideHeaders from "./SideHeaders";
import Complain from "./Pages/Complain";

import Student from "./Pages/Student";
import Department from "./Pages/Department";
import CafeCataloge from "./Pages/CafeCataloge";

import Acadamics from "./Pages/Acadamics";
import CourseOfferingPage from "./Pages/CourseOfferingPage";
import Verification from "./Pages/Verification";
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import Class from "./Pages/Class";


import ScialClubs from "./Pages/SocialClubs";
import Event from "./Pages/Event";
import Notifications from "./Pages/Notifications";
import Permission from "./Pages/Permission";

import GateList from "./Pages/GateList";
import Login from "./Pages/Login";
import SocialDetail from "./Pages/SocialDetail";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import TeacherDashboard from "./Pages/TeacherDashboard";
import ClassDetailed from "./Pages/ClassDetailed";
import NotificationManagement from "./Pages/NotificationManagement";

function App() {
    const auth = useAuthUser()
  
  return (
    <div className=" flex flex-row overflow-hidden bg-white font-Roboto flex-1 w-screen h-screen">
    
      <SideHeaders />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route element={<AuthOutlet fallbackPath="/login" />}>
        

{
  auth?.role === "systemadmin"?
<>
        <Route path="/" element={<Dashboard />} />
        <Route path="/complain" element={<Complain />} />
        <Route path="/cafe/:type?" element={<CafeCataloge />} />
        <Route path="/Gate/report" element={<GateList/>} />
        <Route path="/student/:type?" element={<Student />} />
        <Route path="/department" element={<Department />} />
      
        <Route path="/academics" element={<Acadamics />} />
        <Route
          path="/CourseOffering/:department/:year/:semester"
          element={<CourseOfferingPage />}
        />
      
        <Route path="/student/verifications" element={<Verification />} />
        <Route path="/SocialClubs" element={<ScialClubs />} />
        <Route path="/SocialClubs/:id" element={<SocialDetail/>} />
        <Route path="/Event" element={<Event />} />
        <Route path="/Notification" element={<Notifications />} />
        <Route path="/Permission" element={<Permission />} />
        </>:<>
        <Route path="/" element={
       <TeacherDashboard/>
        }></Route>
        <Route path="/class" element={
       <Class/>
        }/>
        <Route path="/CourseOffering/:department/:year/:semester/:courseid" element={
        <ClassDetailed />
        }/>
        <Route path="/notify" element={
          <NotificationManagement/>
        }
        />
        <Route path="/calendar" element={
          <Event/>
        }/>
        
        </>
}
        </Route>
      

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
