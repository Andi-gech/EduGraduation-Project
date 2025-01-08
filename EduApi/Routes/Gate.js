const express = require("express");
const Router = express.Router();
const { User } = require("../Model/User");

const {Permission}=require("../Model/Permission")
const { Gate }=require("../Model/GateController")
const { verifyDigitalId }=require("../utils/VerifyDigitalId")
Router.put(
  "/scanIn",

  async (req, res) => {
    try {
      const { qrurl } = req.body;
    if (!qrurl) return res.status(400).send("QR URL is required.");

     let studentid;
    try {
      studentid = verifyDigitalId(qrurl);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const student = await User.findOne({ auth: studentid });
    if (!student) return res.status(400).send("Student not found.");

    
    
    await Gate.findOneAndUpdate({
      user: student._id
    }, { $set: { Entry: true } },{new:true,upsert:true});
    

      return res.send("Checked in successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Something went wrong");
    }
  }
);
const haspermision=async(studentid)=>{
  const permission = await Permission.findOne({
    user: studentid,
    permissionDate: new Date().toISOString().split("T")[0],
  });
  console.log(permission,"permission")
  if (!permission) return false;
  return true;
}
Router.put(
  "/scanOut",
 
  async (req, res) => {
    try {
      const { qrurl } = req.body;
    if (!qrurl) return res.status(400).send("QR URL is required.");

     let studentid;
    try {
      studentid = verifyDigitalId(qrurl);
    } catch (error) {
      return res.status(400).send(error.message);
    }

    const student = await User.findOne({ auth: studentid });
    if (!student) return res.status(400).send("Student not found.");
    const today = new Date().getDay(); 
    const isWeekend = today === 0 || today === 5 || today === 6; 

    if (
      !haspermision(student._id) && 
      !(isWeekend && !student.isMilitary) 
    ) {
      return res.status(400).send("You don't have permission to leave the campus");
    }
      await Gate.findOneAndUpdate({
        user: student._id,
       }, { $set: { Entry: false } },{ new: true, upsert: true });
      

      return res.send("Checked out successfully");
    } catch (error) {
      console.log(error)
      return res.status(500).send(error.message || "Something went wrong");
    }
  }
);
Router.get("/report", async (req, res) => {
  try {
    const report = await Gate.aggregate([
      {
        $match: { Entry: true } 
      },
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails" 
      },
      {
        $group: {
          _id: "$userDetails.isMilitary", 
          count: { $sum: 1 } 
        }
      },
      {
        $project: {
          _id: 0,
          type: {
            $cond: { if: { $eq: ["$_id", true] }, then: "military", else: "civilian" }
          },
          count: 1
        }
      }
    ]);

    const result = report.reduce((acc, { type, count }) => {
      acc[type] = count;
      return acc;
    }, {});

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error.message || "Something went wrong");
  }
});


module.exports = Router;
