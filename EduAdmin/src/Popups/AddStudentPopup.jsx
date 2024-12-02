/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { AiFillCloseCircle } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import IsLoading from "../Components/IsLoading";

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
  studentId: "", // Add the studentId field
};

export default function AddStudentPopup({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState(initialStudentData);
  const transformStudentDataForBackend = (studentData) => {
    return {
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
        semister: String(studentData.semester), // Fix typo (semister -> semester)
      },
    };
  };

  const steps = ["User Profile", "Authentication Details"];
  const departments = [
    "Computer Science",
    "electronics",
    "civil",
    "Mechanical",
    "Electrical",
    "Aeronautical",
    "Production",
    "chemical",
    "Motor Vehicles",
  ];
  const semesters = [
    { value: 1, label: "Fall" },
    { value: 2, label: "Spring" },
  ];

  const yearLevels = [1, 2, 3, 4, 5];

  // Mutation for submitting the student data
  const mutation = useMutation(
    (newStudent) =>
      axios.post("http://eduapi.senaycreatives.com/auth/register", newStudent) // Replace with your actual API endpoint
  );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const formattedData = transformStudentDataForBackend(studentData);
      console.log("Student data to be submitted", formattedData);
      // Trigger the mutation when submitting
      mutation.mutate(formattedData, {
        onSuccess: () => {
          console.log("Student data submitted successfully!");
          onClose(); // Close the popup
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {mutation.isLoading && <IsLoading />}
      <DialogTitle>
        <div className="flex items-center justify-between">
          Add Student
          <AiFillCloseCircle
            className="text-red-600 cursor-pointer"
            onClick={onClose}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <div className="flex flex-col space-y-4 mt-4">
            <TextField
              label="First Name"
              name="firstName"
              value={studentData.firstName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={studentData.lastName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Gender"
              name="gender"
              value={studentData.gender}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Student ID"
              name="studentId"
              value={studentData.studentId}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={studentData.department}
                onChange={handleChange}
                fullWidth
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={studentData.semester}
                onChange={handleChange}
                fullWidth
              >
                {semesters.map((sem) => (
                  <MenuItem key={sem.value} value={sem.value}>
                    {sem.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Year Level</InputLabel>
              <Select
                name="yearLevel"
                value={studentData.yearLevel}
                onChange={handleChange}
                fullWidth
              >
                {yearLevels.map((year) => (
                  <MenuItem key={year} value={year}>
                    {`${year}${
                      year === 1
                        ? "st"
                        : year === 2
                        ? "nd"
                        : year === 3
                        ? "rd"
                        : "th"
                    } Year`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="isMilitary"
                  checked={studentData.isMilitary}
                  onChange={handleChange}
                />
              }
              label="Military"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="incomponund"
                  checked={studentData.incomponund}
                  onChange={handleChange}
                />
              }
              label="In Compound"
            />
          </div>
        )}

        {activeStep === 1 && (
          <div className="flex flex-col space-y-4 mt-4">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={studentData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={studentData.password}
              onChange={handleChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToPrivacy"
                  checked={studentData.agreeToPrivacy}
                  onChange={handleChange}
                />
              }
              label="I agree to the privacy policy"
            />
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={activeStep === 1 && !studentData.agreeToPrivacy}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
