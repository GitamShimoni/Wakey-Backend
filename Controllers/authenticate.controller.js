const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const login = async (req, res) => {
  const { username, password } = req.body;
  const existUser = await User.findOne({ username });
  if (!existUser) {
    return res.status(401).json({ message: "Couldn't find this user" });
  }
  bcrypt.compare(password, existUser.password, (err, isMatch) => {
    if (err || !isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    } else {
      const token = jwt.sign({ id: existUser._id }, process.env.SECRET);
      res.json({ token });
      // res
      //   .cookie("token", token, { maxAge: 4 * 60 * 60 * 1000, httpOnly: false })
      //   .send();
      // return res.status(201).json({message: "Logged in succesfully!"})
    }
  });
};

const register = async (req, res) => {
  const {
    username,
    password,
    //  fullname, gender, email, birthdate
  } = req.body;
  console.log(username, password);
  //  fullname, gender, email, birthdate);
  try {
    const registerExists = await User.findOne({ username: req.body.username });
    console.log(registerExists);
    if (registerExists) {
      return res.status(400).json("User is already registered!");
    }
    console.log(password, "This is the password");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword, "This is the hashed password");
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isSleeping: false,
      voiceType: 0,
      appUses: 0,
      // fullname,
      // gender,
      // email,
      // birthdate,
    });
    console.log(newUser, "This is the new user");
    return res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
  //   console.log(newUser);
};

module.exports = { login, register };
