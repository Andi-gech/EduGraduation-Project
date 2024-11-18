import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import SideHeaders from "./SideHeaders";
import Complain from "./Pages/Complain";

import Student from "./Pages/Student";
import Department from "./Pages/Department";
import CafeCataloge from "./Pages/CafeCataloge";
import CafeSub from "./Pages/CafeSub";
import Cafe from "./Pages/Cafe";
import AddCafeSubscription from "./Pages/AddCafeSubscription";
import Acadamics from "./Pages/Acadamics";
import CourseOfferingPage from "./Pages/CourseOfferingPage";
import Verification from "./Pages/Verification";
import DigitalIdCards from "./Pages/DigitalIdCards";

import ScialClubs from "./Pages/ScialClubs";
import Event from "./Pages/Event";

function App() {
  return (
    <div className=" flex flex-row overflow-hidden bg-white flex-1 w-screen h-screen">
      <SideHeaders />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/complain" element={<Complain />} />
        <Route path="/cafe" element={<CafeCataloge />} />
        <Route path="/student" element={<Student />} />
        <Route path="/department" element={<Department />} />
        <Route path="/cafe/subscription" element={<CafeSub />} />
        <Route path="/cafe/addsubscription" element={<AddCafeSubscription />} />
        <Route path="/cafe/gate" element={<Cafe />} />
        <Route path="/Acadamics" element={<Acadamics />} />
        <Route
          path="/CourseOffering/:department/:year/:semester"
          element={<CourseOfferingPage />}
        />
        <Route path="/student/IdentityCard" element={<DigitalIdCards />} />
        <Route path="/student/verifications" element={<Verification />} />
        <Route path="/SocialClubs" element={<ScialClubs />} />
        <Route path="/Event" element={<Event />} />
      </Routes>
    </div>
  );
}

export default App;
