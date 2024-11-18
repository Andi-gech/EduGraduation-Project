const express = require("express");
const { EnrollCourse, ValidateEnrollCourse } = require("../Model/EnrollCourse");
const { User } = require("../Model/User");
const { CourseOffering, validate } = require("../Model/CourseOffering");
const { Course, ValidateCourse } = require("../Model/Course");
const Router = express.Router();
const Authetication = require("../MiddleWare/AuthMiddleware");
const { Class } = require("../Model/Class");

/**
 * @swagger
 * /enrollment/currentEnrollment:
 *   get:
 *     summary: Get current enrollment information for the user
 *     description: Retrieves the user's current course enrollments based on their class year level and semester.
 *     tags: [Enrollments]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: User's current course enrollments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Enrollment ID
 *                     example: "60a8e3622f8b9a3a4c8b9f13"
 *                   user:
 *                     type: string
 *                     description: User ID
 *                     example: "60a8e3b4f7c8e835d9b8c834"
 *                   currentYear:
 *                     type: integer
 *                     description: Year level of the user's class.
 *                     example: 3
 *                   currentSemester:
 *                     type: integer
 *                     description: Semester of the user's class.
 *                     example: 2
 *                   course:
 *                     type: object
 *                     description: Course details
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Course ID
 *                         example: "60a8e41df7c8e835d9b8c835"
 *                       name:
 *                         type: string
 *                         description: Name of the course
 *                         example: "Introduction to Programming"
 *                       credits:
 *                         type: integer
 *                         description: Number of credits for the course
 *                         example: 3
 *       400:
 *         description: Invalid user or no enrollments found for the semester.
 *       500:
 *         description: Internal server error.
 */

Router.get("/currentEnrollment", Authetication, async (req, res) => {
  const user = await User.find({
    auth: req.user._id,
  }).populate({
    path: "Class",
    model: "Class",
  });
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
    return res.status(400).send("You Have Not Registerd for this semister");
  res.send(enroll);
});
/**
 * @swagger
 * /enrollment/enroll:
 *   post:
 *     summary: Enroll a user in a course
 *     description: Allows an authenticated user to enroll in a course for the current year and semester.
 *     tags: [Enrollments]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course:
 *                 type: string
 *                 description: ID of the course to enroll in.
 *                 example: "60a8e41df7c8e835d9b8c835"
 *     responses:
 *       200:
 *         description: User successfully enrolled in the course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Enrollment ID
 *                   example: "60a8e3622f8b9a3a4c8b9f13"
 *                 user:
 *                   type: string
 *                   description: User ID
 *                   example: "60a8e3b4f7c8e835d9b8c834"
 *                 currentYear:
 *                   type: integer
 *                   description: Year level of the user's class.
 *                   example: 3
 *                 currentSemester:
 *                   type: integer
 *                   description: Semester of the user's class.
 *                   example: 2
 *                 course:
 *                   type: string
 *                   description: ID of the enrolled course.
 *                   example: "60a8e41df7c8e835d9b8c835"
 *       400:
 *         description: Invalid user, course validation error, or already enrolled in the course.
 *       500:
 *         description: Internal server error.
 */
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
/**
 * @swagger
 * /enrollment/GetAllClass:
 *   get:
 *     summary: Retrieve all class information
 *     description: Returns all class information
 *     tags:
 *       - Class
 *     responses:
 *       200:
 *         description: Successfully retrieved class information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Class ID
 *                   example: "60a8e3622f8b9a3a4c8b9f13"
 *                 yearLevel:
 *                   type: integer
 *                   description: Year level of the class
 *                   example: 3
 *                 department:
 *                   type: string
 *                   description: Department of the class
 *                   example: "Computer Science"
 *                 semester:
 *                   type: integer
 *                   description: Semester of the class
 *                   example: 2
 *                 date:
 *                   type: string
 *                   description: Date of the class
 *                   example: "2021-05-21T00:00:00.000Z"
 *       400:
 *         description: No class information found.
 *       500:
 *         description: Internal server error.
 */

Router.get("/GetAllClass", async (req, res) => {
  const classs = await Class.find();
  res.send(classs);
});
/**
 * @swagger
 * /enrollment/GetMyoffering:
 *   get:
 *     summary: Retrieve course offerings for the current user
 *     description: Returns the available course offerings based on the user's class information.
 *     tags: [Course Offerings]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved course offerings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Course offering ID
 *                   example: "60a8e3622f8b9a3a4c8b9f13"
 *                 department:
 *                   type: string
 *                   description: Department of the course offering
 *                   example: "Computer Science"
 *                 yearLevel:
 *                   type: integer
 *                   description: Year level for the course offering
 *                   example: 3
 *                 semister:
 *                   type: integer
 *                   description: Semester for the course offering
 *                   example: 2
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: string
 *                         description: ID of the course
 *                         example: "60a8e41df7c8e835d9b8c835"
 *                       courseName:
 *                         type: string
 *                         description: Name of the course
 *                         example: "Introduction to Programming"
 *       400:
 *         description: Invalid user or no offerings found for the user.
 *       500:
 *         description: Internal server error.
 */

Router.get("/GetMyoffering", Authetication, async (req, res) => {
  try {
    console.log("offering");
    const user = await User.find({
      auth: req.user._id,
    }).populate({
      path: "Class",
      model: "Class",
    });
    if (!user) return res.status(400).send("Invalid user");
    console.log(user[0].Class.department);
    console.log(user[0].Class.yearLevel);
    console.log(user[0].Class.semister);

    const offerdCourse = await CourseOffering.findOne({
      department: user[0].Class.department,
      yearLevel: user[0].Class.yearLevel,
      semister: user[0].Class.semister,
    }).populate({
      path: "courses.course",
      model: "Course",
    });
    console.log(offerdCourse);

    return res.send(offerdCourse);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
/**
 * @swagger
 * /enrollment/Getoffering:
 *   get:
 *     summary: Retrieve course offerings
 *     description: Get the list of course offerings based on the specified department, year level, and semester.
 *     tags: [Course Offering]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: The department to filter course offerings.
 *       - in: query
 *         name: yearLevel
 *         required: true
 *         schema:
 *           type: string
 *         description: The year level to filter course offerings.
 *       - in: query
 *         name: semister
 *         required: true
 *         schema:
 *           type: string
 *         description: The semester to filter course offerings (e.g., "1" for Fall, "2" for Spring).
 *     responses:
 *       200:
 *         description: A course offering object containing the details of the courses offered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department:
 *                   type: string
 *                   example: "Computer Science"
 *                 yearLevel:
 *                   type: string
 *                   example: "2"
 *                 semister:
 *                   type: string
 *                   example: "1"
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       course:
 *                         type: string
 *                         description: The course ID or name.
 *                       title:
 *                         type: string
 *                         description: The title of the course.
 *                       teacher:
 *                         type: string
 *                         description: The teacher's ID associated with the course.
 *                       Schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             day:
 *                               type: string
 *                               enum: [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
 *                               description: Day of the schedule.
 *                             time:
 *                               type: string
 *                               description: The time slot for the course on that day.
 *       400:
 *         description: Bad request. Invalid input.
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       404:
 *         description: Not found. No offerings found for the provided criteria.
 *       500:
 *         description: Internal server error. An error occurred while processing the request.
 */

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
    console.log(offeredCourse);

    if (!offeredCourse) {
      console.log("offering");
      offeredCourse = new CourseOffering({
        department: department,
        yearLevel: yearLevel,
        semister: semister,
        courses: [],
      });
      await offeredCourse.save();
    }
    console.log(offeredCourse);
    return res.send(offeredCourse);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

/**
 * @swagger
 * /enrollment/GetSchedule:
 *   get:
 *     summary: Retrieve the class schedule for the current user
 *     description: Returns the schedule for courses offered to the user based on their class information, grouped by day.
 *     tags: [Schedule]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the schedule.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseName:
 *                       type: string
 *                       description: Name of the course.
 *                       example: "Introduction to Programming"
 *                     time:
 *                       type: string
 *                       description: Scheduled time for the course.
 *                       example: "10:00 AM - 11:30 AM"
 *       400:
 *         description: Invalid user or no course offerings found.
 *       404:
 *         description: No course offering found.
 *       500:
 *         description: Internal server error.
 */

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
    });

    if (!offeredCourse) return res.status(404).send("No course offering found");

    // Create an object to store schedule by day
    const scheduleByDay = {};

    // Loop through the courses and schedule them by day
    offeredCourse.courses.forEach((courseObj) => {
      const course = courseObj.course; // Populated course details

      courseObj.Schedule.forEach((schedule) => {
        const day = schedule.day;
        const time = schedule.time;

        // Initialize the day in the result if it doesn't exist
        if (!scheduleByDay[day]) {
          scheduleByDay[day] = [];
        }

        // Add course and its schedule to the corresponding day
        scheduleByDay[day].push({
          courseName: course.Coursename, // Assuming 'name' is the course name
          time: time,
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
  console.log(req.body);
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

  console.log(req.body);
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

    // Create a new course object to add
    const newCourse = {
      course: courseId,
      teacher: teacherId,
      Schedule: Schedule,
    };

    // Push the new course to the courses array
    courseOffering.courses.push(newCourse);

    await courseOffering.save();
    res.send(courseOffering);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

Router.get("/GetAllOffering", async (req, res) => {
  const offering = await CourseOffering.find();
  res.send(offering);
});
module.exports = Router;
