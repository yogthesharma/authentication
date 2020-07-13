const express = require(`express`);
const bcrypt = require(`bcryptjs`);
const jwt = require(`jsonwebtoken`);
// importing the authentication middleware
const auth = require("../middleware/auth");
// getting model
const User = require(`../models/userModel`);
// creating new router from express
const router = express.Router();

// registering new router config
router.post("/register", async (req, res) => {
  try {
    let { name, email, gender, password, checkPassword } = req.body;
    const genderAvailable = ["Male", "Female", "Others", "Rather Not To Say"];

    //   validating conditions
    if (!name || !email || !gender || !password)
      return res
        .status(400)
        .json({ msg: "Enter All The Fields Carefully", errMsg: true });

    const emailCheck = await User.findOne({ name });
    if (emailCheck)
      return res
        .status(400)
        .json({ mag: "Email Already Exists", errMsg: true });

    if (checkPassword !== password)
      return res.status(400).json({
        msg: "Passwords Not Correctly Confirmed",
        errMsg: true,
      });

    //   hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const user = new User({
      name,
      email,
      gender,
    });

    await user.save();
    res.status(201).json({
      msg: "User Created Successfully",
      user: { name: user.name, email: user.email, gender: user.gender },
      errMsg: false,
    });
  } catch (error) {
    res.status(500).json({ error, errMsg: true });
  }
});

// logging user in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ msg: "Enter All The Fields Carefully", errMsg: true });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No Account With This Email Exists", errMsg: true });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Password May Not Be Correct", errMsg: true });

    // generating session token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    res.status(500).json({ error, errMsg: true });
  }
});

// deleting the user but we have to do the authentication first

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json({ msg: "User Deleted", deletedUser, errMsg: false });
  } catch (error) {
    res.status(500).json({ error, errMsg: true });
  }
});

// checking if the token is valid
router.post("/isTokenValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verify = await jwt.verify(token, process.env.JWT_KEY);
    if (!verify) return res.json(false);

    const user = await User.findById(verify.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (error) {
    res.status(500).json({ error, errMsg: true });
  }
});

// getting the currently logged in user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) return res.json({ msg: "User Not Found", errMsg: true });
  res.json({
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
    },
    errMsg: false,
  });
});

// exporting the router
module.exports = router;
