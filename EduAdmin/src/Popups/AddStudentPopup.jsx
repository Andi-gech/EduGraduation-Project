import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import svg from "../assets/student.svg";

const initialStudentData = {
  firstName: "",
  lastName: "",
  gender: "",
  isMilitary: false,
  department: "",
  semester: "",
  yearLevel: "",
  profilePic: "",
  auth: "",
  Enrollment: [],
  incomponund: false,
  date: new Date().toISOString(),
  email: "",
  password: "",
  agreeToPrivacy: false,
  studentId: "",
};

export default function AddStudentForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState(initialStudentData);

  const transformStudentDataForBackend = (studentData) => ({
    user: {
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      gender: studentData.gender,
      isMilitary: studentData.isMilitary,
      studentid: studentData.studentId,
    },
    auth: {
      email: studentData.email,
      password: studentData.password,
      Role: "student",
    },
    class: {
      department: studentData.department,
      yearLevel: String(studentData.yearLevel),
      semester: String(studentData.semester),
    },
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

  const mutation = useMutation((newStudent) =>
    axios.post("http://eduapi.senaycreatives.com/auth/register", newStudent)
  );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const formattedData = transformStudentDataForBackend(studentData);
      mutation.mutate(formattedData, {
        onSuccess: () => {
          console.log("Student data submitted successfully!");
        },
        onError: (error) => {
          console.error("Failed to submit student data", error);
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
    setStudentData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const Generate4digit = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setStudentData((prevData) => ({
      ...prevData,
      studentId: random,
    }));
  }

  return (
     <div className="flex justify-between items-center">
        
        
    
          
         
    <div className="max-w-[350px] mx-auto p-6 bg-gradient-to-r from-purple-200 to-purple-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add Student
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
      value={studentData.firstName}
      onChange={handleChange}
    />
    <input
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={studentData.lastName}
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
            checked={studentData.gender === "Male"}
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
            checked={studentData.gender === "Female"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
          />
          <span>Female</span>
        </label>
      </div>
    </div>
    <div  className="relative">
    <input
      className="w-full  p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      type="text"
      name="studentId"
      placeholder="Student ID"
      value={studentData.studentId}
      onChange={handleChange}
    />
    <div onClick={Generate4digit} className="absolute h-[40px] cursor-pointer  mt-[5px] mx-3 px-3 rounded-md  bg-zinc-200 top-0 right-0 flex items-center pr-3">
      <p className="text-zinc-900">Generate</p>
      </div>
    
      
    </div>
     
    <label className="flex items-center space-x-2">
      <input
       type="radio"
        name="isMilitary"
        checked={studentData.isMilitary}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring focus:ring-blue-200"
      />
      <span>Military</span>
    </label>
  </div>
)}


        {activeStep === 1 && (
          <div className="space-y-4">
            <select
              className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              name="department"
              value={studentData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              name="semester"
              value={studentData.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
                </option>
              ))}
            </select>
            <select
              className="w-full p-3 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              name="yearLevel"
              value={studentData.yearLevel}
              onChange={handleChange}
            >
              <option value="">Select Year Level</option>
              {yearLevels.map((year) => (
                <option key={year} value={year}>
                  {year} Year
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
              value={studentData.email}
              onChange={handleChange}
            />
            <input
              className="w-full p-3 border  border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              type="password"
              name="password"
              placeholder="Password"
              value={studentData.password}
              onChange={handleChange}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={studentData.agreeToPrivacy}
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
          disabled={activeStep === 2 && !studentData.agreeToPrivacy}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
    <img src={svg} className="flex w-[60%] h-[500px]  items-center"/>
     
  </div>
  );
}
