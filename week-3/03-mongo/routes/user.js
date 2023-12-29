const { Router } = require("express");
const { User, Course } = require("../db");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    })

    res.json({
        msg: "User Created Sucessfully"
    })
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic\
    const response = await Course.find({});

    res.json({
        courses: response
    })

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })

    res.json({
        msg: "Purchase Sucessful"
    })

});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = User.findOne({
        username: req.headers.username
    })
    const courses = Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })

    res.json({
        purchasedCourses: courses
    })

});

module.exports = router