import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import svg from "../assets/student.svg";
import Api from "../utils/Api";

const initialteacherData = {
  firstName: "",
  lastName: "",
  gender: "",
  isMilitary: false,
  department: "",

  profilePic: "",
  auth: "",

  date: new Date().toISOString(),
  email: "",
  password: "",
  agreeToPrivacy: false,
 
};

export default function AddteacherForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [teacherData, setteacherData] = useState(initialteacherData);

  const transformteacherDataForBackend = (teacherData) => ({
    user: {
      firstName: teacherData.firstName,
      lastName: teacherData.lastName,
      gender: teacherData.gender,
      isMilitary: teacherData.isMilitary,
    department: teacherData.department,
    },
    auth: {
      email: teacherData.email,
      password: teacherData.password,
      Role: "teacher",
    }
  });

  const steps = ["Basic Details", "Class Details", "Authentication Details"];
  const departments = [
    "Computer Science",
    "Electronics",
    "Civil",
    "Mechanical",
    "Electrical",
    "Aeronautical",
    "Production",
    "Chemical",
    "Motor Vehicles",
  ];
  const semesters = [
    { value: 1, label: "Fall" },
    { value: 2, label: "Spring" },
  ];
  const yearLevels = [1, 2, 3, 4, 5];

  const mutation = useMutation((newteacher) =>
    Api.post("/auth/createTeacher", newteacher)
  );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const formattedData = transformteacherDataForBackend(teacherData);
     console.log(formattedData);
      mutation.mutate(formattedData, {
        onSuccess: () => {
          console.log("teacher data submitted successfully!");
        },
        onError: (error) => {
          console.error("Failed to submit teacher data", error);
        },
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setteacherData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const Generate4digit = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setteacherData((prevData) => ({
      ...prevData,
      teacherId: random,
    }));
  }

  return (
     <div className="flex justify-between items-center">
        
        
    
          
         
    <div className="max-w-[350px] mx-auto p-6 bg-gradient-to-r from-purple-200 to-purple-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add teacher
      </h1>

     
      <div className="flex justify-center space-x-2 mb-6">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors duration-300
              ${activeStep === index ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

   
      <div className="space-y-6">
      {activeStep === 0 && (
  <div className="space-y-4">
    <input
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      type="text"
      name="firstName"
      placeholder="First Name"
      value={teacherData.firstName}
      onChange={handleChange}
    />
    <input
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={teacherData.lastName}
      onChange={handleChange}
    />
    <div>
      <label className="block text-gray-700 font-medium mb-2">Gender</label>
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={teacherData.gender === "Male"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
          />
          <span>Male</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={teacherData.gender === "Female"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
          />
          <span>Female</span>
        </label>
      </div>
    </div>
  
    <label className="flex items-center space-x-2">
      <input
       type="radio"
        name="isMilitary"
        value={true}
        checked={teacherData.isMilitary}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
      />
      <span>Military</span>
    </label>
  </div>
)}


        {activeStep === 1 && (
          <div className="space-y-4 p-8 ">
            <select
              className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              name="department"
              value={teacherData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            
         
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <input
              className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              type="email"
              name="email"
              placeholder="Email"
              value={teacherData.email}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border  border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              type="password"
              name="password"
              placeholder="Password"
              value={teacherData.password}
              onChange={handleChange}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={teacherData.agreeToPrivacy}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
              />
              <span>I agree to the privacy policy</span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-gray-200 disabled:opacity-50"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 transition-colors duration-300
            ${activeStep === steps.length - 1 ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
          onClick={handleNext}
          disabled={activeStep === 2 && !teacherData.agreeToPrivacy}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
    <img src={svg} className="flex w-[60%] h-[500px]  items-center"/>
     
  </div>
  );
}
