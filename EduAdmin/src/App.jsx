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
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'


import ScialClubs from "./Pages/SocialClubs";
import Event from "./Pages/Event";
import Notifications from "./Pages/Notifications";
import Permission from "./Pages/Permission";

import GateList from "./Pages/GateList";
import Login from "./Pages/Login";
import SocialDetail from "./Pages/SocialDetail";

function App() {
  return (
    <div className=" flex flex-row overflow-hidden bg-white font-Roboto flex-1 w-screen h-screen">
    
      <SideHeaders />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route element={<AuthOutlet fallbackPath="/login" />}>
        


        <Route path="/" element={<Dashboard />} />
        <Route path="/complain" element={<Complain />} />
        <Route path="/cafe" element={<CafeCataloge />} />
        <Route path="/Gate/report" element={<GateList/>} />
        <Route path="/student" element={<Student />} />
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
        </Route>
      

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
