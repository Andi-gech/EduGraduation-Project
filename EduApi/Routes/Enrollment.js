const express = require("express");
const { EnrollCourse, ValidateEnrollCourse } = require("../Model/EnrollCourse");
const { User } = require("../Model/User");
const { CourseOffering, validate } = require("../Model/CourseOffering");
const { Course, ValidateCourse } = require("../Model/Course");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");
const { Class } = require("../Model/Class");
const { EnrollTransaction } = require("../Model/EnrollTransaction");
const Chapa = require("chapa");
const mongoose= require("mongoose")
let myChapa = new Chapa("CHASECK_TEST-gFVzUEvX8t2gMphMHXxf4v75KOnyHIPE");

Router.get("/checkEnrollment", Authetication, async (req, res) => {
  const user = await User.find({
    auth: req.user._id,
  }).populate({
    path: "Class",
    model: "Class",
  });
  const checkEnrollment=await EnrollTransaction.find({
    studentId:user[0]._id,
    yearLevel:user[0].Class.yearLevel,
    department:user[0].Class.department,
    semister:user[0].Class.semister
  })
  if(checkEnrollment.length==0){
    return res.status(400).send("please pay your  Semister Registration fees first");
  }
  res.send({
    status:true,
  });
}
)
Router.get("/getEnrollmentTransaction",  async (req, res) => {
  const enrollments=await EnrollTransaction.find().populate({
    path: "studentId",
    model: "User",
  })
  res.send(enrollments);
});


Router.get("/currentEnrollment", Authetication, async (req, res) => {
  const user = await User.find({
    auth: req.user._id,
  }).populate({
    path: "Class",
    model: "Class",
  });
  const checkEnrollment=await EnrollTransaction.find({
    studentId:user[0]._id,
    yearLevel:user[0].Class.yearLevel,
    department:user[0].Class.department,
    semister:user[0].Class.semister
  })
  if(checkEnrollment.length==0){
    return res.status(400).send("please pay your  Semister Registration fees first");
  }
  if (!user) return res.status(400).send("Invalid user");
  const enroll = await EnrollCourse.find({
    user: user[0]._id,
    currentYear: user[0].Class.yearLevel,
    currentSemester: user[0].Class.semister,
  }).populate({
    path: "course",
    model: "Course",
  });

  if (!enroll || enroll.length == 0)
    return res.status(400).send("No course enrolled");
  res.send(enroll);
});

Router.post("/enroll", Authetication, async (req, res) => {
  const { error } = ValidateEnrollCourse;
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find({
    auth: req.user._id,
  }).populate({
    path: "Class",
    model: "Class",
  });

  if (!user) return res.status(400).send("Invalid user");
  const checkEnrollment=await EnrollTransaction.find({
    studentId:user[0]._id,
    yearLevel:user[0].Class.yearLevel,
    department:user[0].Class.department,
    semister:user[0].Class.semister
  })
  if(checkEnrollment.length==0){
    return res.status(400).send("please pay your  Semister Registration fees first");
  }

  const isAlreadyEnroll = await EnrollCourse.findOne({
    user: user[0]._id,
    currentYear: user[0].Class.yearLevel,
    currentSemester: user[0].Class.semister,
    course: req.body.course,
  });

  if (isAlreadyEnroll) return res.status(400).send("Already Enrolled");

  const Enrolled = EnrollCourse({
    user: user[0]._id,
    currentYear: user[0].Class.yearLevel,
    currentSemester: user[0].Class.semister,
    course: req.body.course,
  });

  await Enrolled.save();

  return res.send(Enrolled);
});


Router.get("/GetAllClass", async (req, res) => {
  const classs = await Class.find();
  res.send(classs);
});

Router.get("/GetMyoffering", Authetication, async (req, res) => {
  try {
    
    const user = await User.find({
      auth: req.user._id,
    }).populate({
      path: "Class",
      model: "Class",
    });
    if (!user) return res.status(400).send("Invalid user");
    const checkEnrollment=await EnrollTransaction.find({
      studentId:user[0]._id,
      yearLevel:user[0].Class.yearLevel,
      department:user[0].Class.department,
      semister:user[0].Class.semister
    })
    if(checkEnrollment.length==0){
      return res.status(400).send("please pay your  Semister Registration fees first");
    }
  
    const offerdCourse = await CourseOffering.findOne({
      department: user[0].Class.department,
      yearLevel: user[0].Class.yearLevel,
      semister: user[0].Class.semister,
    }).populate({
      path: "courses.course",
      model: "Course",
    });
   
    return res.send(offerdCourse);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

Router.get("/vetifyPayment", async (req, res) => {
  try {
    const response=await myChapa.verify(req.body.trx_ref )
  

 
   
    if (response.data.status !== "success") {
      return res.status(400).send("Payment verification failed");
    }
    
    const user=await User.findById(response.data.meta.reference).populate({
      path: "Class",
      model: "Class",
    })
    if (req.body.status === "success") {
    const enroll = new EnrollTransaction({
      studentId:user._id,
      yearLevel:user?.Class.yearLevel,
      department:user?.Class.department,
      semister:user?.Class.semister,
      amount:response.data.amount,
      paymentMethod:response.data.method,
      mobile:response.data.phone_number,
      status:"Success",
      transactionId:response.data.tx_ref,
      transactionDate:response.data.created_at
    });
    await enroll.save();
 console.log("payment verified")
    return res.send(enroll);
  }
  else{
   
    return res.status(400).send("Payment Failed");
  }

  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }}
);
Router.get("/getmyassigned",Authetication, async (req,res) => {
  try {
    console.log(req.user.userid,"ss")
    const teacherId= req.user.userid
    const offerings = await CourseOffering.aggregate([
      { 
        $unwind: '$courses'  // Flatten the 'courses' array so each course is handled individually
      },
      {
        $match: {
          'courses.teacher': new mongoose.Types.ObjectId(teacherId),  // Match by teacher's ObjectId
        },
      },
      {
        $lookup: {
          from: 'courses',  // Lookup in the 'courses' collection to fetch course details
          localField: 'courses.course',  // Match 'course' field from 'courses' in CourseOffering
          foreignField: '_id',  // Match against the '_id' field in the 'courses' collection
          as: 'courseDetails',  // This will store the details of the course
        },
      },
      { 
        $unwind: '$courseDetails'  // Unwind the populated courseDetails array to get each course separately
      },
      {
        $project: {
          yearLevel: 1,  // Include the year level
          semister: 1,   // Include the semester
          department: 1,  // Include the department
          course: '$courseDetails.Coursename',
          courseid:'$courseDetails._id',
          coursecode:'$courseDetails.Coursecode',  // Assuming the 'name' field contains the course name
          schedule: '$courses.Schedule',  // Include the schedule for the course
        },
      },
    ]);


    res.send(offerings);
    
  } catch (error) {
    console.error(error);
   
  }
})


Router.get("/Getoffering", async (req, res) => {
  try {
    const { department, yearLevel, semister } = req.query;

    // Ensure all required query parameters are provided
    if (!department || !yearLevel || !semister) {
      return res
        .status(400)
        .send({ message: "Missing required query parameters" });
    }

    let offeredCourse = await CourseOffering.findOne({
      department,
      yearLevel,
      semister,
    })
      .populate({
        path: "courses.course",
        model: "Course",
      })
      .populate({
        path: "courses.teacher", // Path to the teacher field
        select: "firstName lastName", // Fields to select from the Teacher model
      });
  
    if (!offeredCourse) {
     
      offeredCourse = new CourseOffering({
        department: department,
        yearLevel: yearLevel,
        semister: semister,
        courses: [],
      });
      await offeredCourse.save();
    }
   
    return res.send(offeredCourse);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


const calculatePrice = (offering) => {
  let price = 0;

  offering?.courses?.forEach((course) => {

    price += course?.course?.creaditHrs * 150;
  });
  price += 2500;
  return price;
};

const handleChapaPayment = async (user, price, res) => {
  const CALLBACK_URL = "https://d0h0c4d7-3000.uks1.devtunnels.ms/enrollment/vetifyPayment";
  const customerInfo = {
    amount: price,
    currency: "ETB",
    email: user.auth.email,
    first_name: user.firstName,
    last_name: user.lastName,
    callback_url: CALLBACK_URL ,
    customization: { title: "Test Title", description: "Test Description" },
    meta: { reference: user._id },
  };

  try {
    const response = await myChapa.initialize(customerInfo, { autoRef: true });
    return res.send({
      response,
      email: user.auth.email,
      price: price,
      StartDate: new Date(),
      EndDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error initializing payment");
  }
};
Router.get("/initiateChapa", Authetication, async (req, res) => {
  try {
    const { redirecturl } = req.query;
    
    if (!redirecturl) return res.status(400).send("Missing redirect URL");

    const user = await User.findById(req.user.userid)
      .select("-password")
      .populate("auth").populate({
        path: "Class",
        model: "Class",
      });
    
      const checkEnrollment=await EnrollTransaction.find({
        studentId:user._id,
        yearLevel:user?.Class.yearLevel,
        department:user?.Class.department,
        semister:user?.Class.semister
      })
      if(checkEnrollment.length>0){
        return res.status(400).send("You have already paid your Semister Registration fees");
      }

      const offerdCourse = await CourseOffering.findOne({
        department: user.Class.department,
        yearLevel: user.Class.yearLevel,
        semister: user.Class.semister,
      }).populate({
        path: "courses.course",
        model: "Course",
      });
    if(offerdCourse?.courses?.length > 0){
      const price=calculatePrice(offerdCourse);

 
    await handleChapaPayment(user, price, res, redirecturl);
    }
    else {
      return res.status(400).send("No course offering found")
    }

  } catch (err) {
    console.log("error",err)
    res.status(500).send(err.message || "Something went wrong");
  }
});

Router.get("/GetSchedule", Authetication, async (req, res) => {
  try {
    // Fetch the user based on authentication
    const user = await User.find({
      auth: req.user._id,
    }).populate({
      path: "Class",
      model: "Class",
    });

    if (!user || user.length === 0) return res.status(400).send("Invalid user");
    const offeredCourse = await CourseOffering.findOne({
      department: user[0].Class.department,
      yearLevel: user[0].Class.yearLevel,
      semister: user[0].Class.semister,
    }).populate({
      path: "courses.course",
      model: "Course", // Assuming 'Course' is your course model
    }).populate({
      path: "courses.teacher",
      model: "User", // Assuming 'Teacher' is your teacher model
    });

    if (!offeredCourse) return res.status(404).send("No course offering found");

    // Create an object to store schedule by day
    const scheduleByDay = {};

    // Loop through the courses and schedule them by day
    offeredCourse.courses.forEach((courseObj) => {
      const course = courseObj.course; // Populated course details

      courseObj.Schedule.forEach((schedule) => {
        const day = schedule.day;
        const Start = schedule.Start;
        const End = schedule.End;


        // Initialize the day in the result if it doesn't exist
        if (!scheduleByDay[day]) {
          scheduleByDay[day] = [];
        }

        // Add course and its schedule to the corresponding day
        scheduleByDay[day].push({
          courseName: course.Coursename, // Assuming 'name' is the course name
        Start,
        End,
        teacher: `${courseObj.teacher.firstName} ${courseObj.teacher.lastName}`, // Assuming 'name' is the teacher name
        });
      });
    });

    return res.status(200).send(scheduleByDay);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
});
/**
 * @swagger
 * /enrollment/assignCourse:
 *   post:
 *     summary: Assign courses to a department for a specific year level and semester
 *     description: Assigns a set of courses to a given department, year level, and semester, preventing duplicate assignments.
 *     tags: [Course Offering]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of course IDs to be assigned.
 *                 example: ["courseId1", "courseId2"]
 *               department:
 *                 type: string
 *                 description: The department to which the courses will be assigned.
 *                 example: "Computer Science"
 *               yearLevel:
 *                 type: integer
 *                 description: The year level for the course offering.
 *                 example: 2
 *               semister:
 *                 type: string
 *                 description: The semester for the course offering (e.g., "Fall", "Spring").
 *                 example: "Fall"
 *     responses:
 *       200:
 *         description: Successfully assigned courses to the specified department, year level, and semester.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the assigned course offering.
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of course IDs assigned.
 *                 department:
 *                   type: string
 *                   description: Assigned department.
 *                 yearLevel:
 *                   type: integer
 *                   description: Assigned year level.
 *                 semister:
 *                   type: string
 *                   description: Assigned semester.
 *       400:
 *         description: Course already assigned or validation error.
 *       500:
 *         description: Internal server error.
 */
Router.post("/assignCourse", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const courses = await CourseOffering.find({
    department: req.body.department,
    yearLevel: req.body.yearLevel,
    semister: req.body.semister,
  });
  if (courses.length > 0)
    return res.status(400).send("Course Already Assigned");
  const assigncourse = CourseOffering({
    courses: req.body.courses,
    department: req.body.department,
    yearLevel: req.body.yearLevel,
    semister: req.body.semister,
  });
  await assigncourse.save();
  return res.send(assigncourse);
});
/**
 * @swagger
 * /enrollment/CreateCourse:
 *   post:
 *     summary: Create a new course
 *     description: This endpoint allows users to create a new course by providing the course details.
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Coursename:
 *                 type: string
 *                 description: The name of the course.
 *                 example: "Introduction to Programming"
 *               Coursecode:
 *                 type: string
 *                 description: The unique code for the course.
 *                 example: "CS101"
 *               creaditHrs:
 *                 type: integer
 *                 description: The number of credit hours for the course.
 *                 example: 3
 *               department:
 *                 type: string
 *                 description: The department that offers the course.
 *                 example: "Computer Science"
 *     responses:
 *       200:
 *         description: Successfully created a new course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the course.
 *                 Coursename:
 *                   type: string
 *                   description: The name of the course.
 *                 Coursecode:
 *                   type: string
 *                   description: The unique code for the course.
 *                 creaditHrs:
 *                   type: integer
 *                   description: The number of credit hours for the course.
 *                 department:
 *                   type: string
 *                   description: The department that offers the course.
 *       400:
 *         description: Validation error, invalid course details.
 *       500:
 *         description: Internal server error.
 */
Router.post("/CreateCourse", async (req, res) => {
  const { error } = ValidateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = new Course({
    Coursename: req.body.Coursename,
    Coursecode: req.body.Coursecode,
    creaditHrs: req.body.creaditHrs,
    department: req.body.department,
  });
  await course.save();
  return res.send(course);
});

/**
 * @swagger
 * /enrollment/GetAllCourses:
 *   get:
 *     summary: Retrieve all courses
 *     description: This endpoint allows users to retrieve a list of all courses.
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: A list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the course.
 *                   Coursename:
 *                     type: string
 *                     description: The name of the course.
 *                   Coursecode:
 *                     type: string
 *                     description: The unique code for the course.
 *                   creaditHrs:
 *                     type: integer
 *                     description: The number of credit hours for the course.
 *                   department:
 *                     type: string
 *                     description: The department that offers the course.
 *       500:
 *         description: Internal server error.
 */
Router.get("/GetAllCourses", async (req, res) => {
  try {
    const courses = await Course.find();
    return res.send(courses);
  } catch (error) {
    return res.status(500).send("Internal server error.");
  }
});

/**
 * @swagger
 * /enrollment/update/teacher/{offeringId}:
 *   put:
 *     summary: Update teacher for a specific course in a course offering
 *     description: This endpoint updates the teacher assigned to a course within a specific course offering identified by its ID.
 *     parameters:
 *       - name: offeringId
 *         in: path
 *         required: true
 *         description: The ID of the course offering to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "66e4a59c108a4db07d8c8468"
 *               teacherId:
 *                 type: string
 *                 example: "66e4a59c108a4db07d8c8467"
 *     responses:
 *       200:
 *         description: Course offering updated successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Course offering updated successfully."
 *             courseOffering:
 *               type: object
 *               $ref: '#/definitions/CourseOffering'  # Reference to the CourseOffering definition
 *       400:
 *         description: Course ID and Teacher ID are required.
 *       404:
 *         description: Course offering not found or course not found in this offering.
 *       500:
 *         description: Server error.
 */
Router.put("/update/teacher/:offeringId", async (req, res) => {
  const { offeringId } = req.params;
  const { courseId, teacherId } = req.body;
 
  if (!courseId || !teacherId) {
    return res.status(400).send("Course ID and Teacher ID are required.");
  }

  try {
    const courseOffering = await CourseOffering.findById(offeringId);
    if (!courseOffering)
      return res.status(404).send("Course offering not found.");

    const course = courseOffering.courses.id(courseId);
    if (!course)
      return res.status(404).send("Course not found in this offering.");

    // Update the teacher
    course.teacher = teacherId;

    await courseOffering.save();
    res.send(courseOffering);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});
/**
 * @swagger
 * /enrollment/deleteOffering/{id}:
 *   delete:
 *     summary: Delete a specific course offering
 *     description: This endpoint allows users to delete a course offering by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course offering to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course offering deleted successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Course offering deleted successfully."
 *             courseOffering:
 *               type: object
 *               $ref: '#/definitions/CourseOffering'  # Reference to the CourseOffering definition
 *       404:
 *         description: Course offering not found.
 *       500:
 *         description: Server error.
 */
Router.delete("/deleteOffering/:id", async (req, res) => {
  const course = await CourseOffering.findByIdAndRemove(req.params.id);
  if (!course) return res.status(404).send("CourseOffering not found");
  res.send(course);
});
/**
 * @swagger
 * /enrollment/add/course/{offeringId}:
 *   put:
 *     summary: Add a new course to a course offering
 *     description: This endpoint adds a new course to an existing course offering identified by its ID.
 *     parameters:
 *       - name: offeringId
 *         in: path
 *         required: true
 *         description: The ID of the course offering to which the new course will be added.
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         required: true
 *         description: The course details to be added.
 *         schema:
 *           type: object
 *           required:
 *             - courseId
 *             - teacherId
 *             - Schedule
 *           properties:
 *             courseId:
 *               type: string
 *               description: The ID of the course to be added.
 *             teacherId:
 *               type: string
 *               description: The ID of the teacher assigned to the course.
 *             Schedule:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - day
 *                   - Start
 *                   - End
 *                 properties:
 *                   day:
 *                     type: string
 *                     enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *                     description: The day of the week for the class.
 *                   Start:
 *                     type: string
 *                     description: The start time of the class.
 *                   End:
 *                     type: string
 *                     description: The end time of the class.
 *           example:
 *             courseId: "1234567890abcdef12345678"
 *             teacherId: "abcdef1234567890abcdef12"
 *             Schedule:
 *               - day: "Monday"
 *                 Start: "10:00 AM"
 *                 End: "11:00 AM"
 *               - day: "Wednesday"
 *                 Start: "11:00 AM"
 *                 End: "12:00 PM"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - teacherId
 *               - Schedule
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course to be added.
 *               teacherId:
 *                 type: string
 *                 description: The ID of the teacher assigned to the course.
 *               Schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day
 *                     - Start
 *                     - End
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *                       description: The day of the week for the class.
 *                     Start:
 *                       type: string
 *                       description: The start time of the class.
 *                     End:
 *                       type: string
 *                       description: The end time of the class.
 *             example:
 *               courseId: "1234567890abcdef12345678"
 *               teacherId: "abcdef1234567890abcdef12"
 *               Schedule:
 *                 - day: "Monday"
 *                   Start: "10:00 AM"
 *                   End: "11:00 AM"
 *                 - day: "Wednesday"
 *                   Start: "11:00 AM"
 *                   End: "12:00 PM"
 *     responses:
 *       200:
 *         description: Successfully added the course to the offering.
 *         schema:
 *           $ref: '#/definitions/CourseOffering'
 *         examples:
 *           application/json:
 *             {
 *               "courses": [
 *                 {
 *                   "course": "1234567890abcdef12345678",
 *                   "teacher": "abcdef1234567890abcdef12",
 *                   "Schedule": [
 *                     {
 *                       "day": "Monday",
 *                       "Start": "10:00 AM",
 *                       "End": "11:00 AM"
 *                     },
 *                     {
 *                       "day": "Wednesday",
 *                       "Start": "11:00 AM",
 *                       "End": "12:00 PM"
 *                     }
 *                   ]
 *                 }
 *               ],
 *               "yearLevel": "1",
 *               "department": "Computer Science",
 *               "semister": "1",
 *               "date": "2024-11-10T00:00:00.000Z"
 *             }
 *       400:
 *         description: Bad request, missing required fields or course already exists.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Course ID, Teacher ID, and Schedule are required."
 *       404:
 *         description: Course offering not found.
 *       500:
 *         description: Server error.
 */
Router.put("/add/course/:offeringId", async (req, res) => {
  const { offeringId } = req.params;
  const { courseId, teacherId, Schedule } = req.body;

 
  if (!courseId || !teacherId || !Schedule) {
    return res
      .status(400)
      .send("Course ID, Teacher ID, and Schedule are required.");
  }

  try {
    const courseOffering = await CourseOffering.findById(offeringId);
    if (!courseOffering)
      return res.status(404).send("Course offering not found.");

    // Check if the course already exists in the offering
    const existingCourse = courseOffering.courses.find(
      (c) => c.course.toString() === courseId
    );
    if (existingCourse) {
      return res.status(400).send("Course already exists in this offering.");
    }

const formattedSchedule = Schedule.map((s) => ({
  day: s.day,
  Start: s.Start || s.start,  // Ensure correct capitalization
  End: s.End || s.end,
}));
    // Create a new course object to add
    const newCourse = {
      course: courseId,
      teacher: teacherId,
      Schedule: formattedSchedule,
    };
  
    courseOffering.courses.push(newCourse);

    await courseOffering.save();

    res.send(courseOffering);
  } catch (err) {
    console.log(err.message)
    res.status(500).send("Server error: " + err.message);
  }
});
Router.put("/remove/course/:offeringId", async (req, res) => {

  const { offeringId } = req.params;
  const { courseId } = req.body;
  

  if (!courseId) {
    return res
      .status(400)
      .send("Course ID is required.");
  }

  try {

    const courseOffering = await CourseOffering.findById(offeringId);

    if (!courseOffering)
      return res.status(404).send("Course offering not found.");

    // Check if the course already exists in the offering

    const existingCourse = courseOffering.courses.find(
      (c) => c._id.toString() === courseId
    );
    
    if (!existingCourse) {
   
      return res.status(400).send("Course does not exists in this offering.");
    }

   
    courseOffering.courses.pull(existingCourse);
    

    await courseOffering.save();
    res.send(courseOffering);
  } catch (err) {
    console.log(err)
    res.status(500).send("Server error: " + err.message);
  }
}
);
Router.get("/GetAllOffering", async (req, res) => {
  const offering = await CourseOffering.find();
  res.send(offering);
});
module.exports = Router;
