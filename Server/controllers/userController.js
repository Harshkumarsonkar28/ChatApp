const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Userregister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json("User already exists!");

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: newUser._id, username, email ,avatar: newUser.avatar } });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(404).json("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email , avatar: user.avatar} });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get all user

const getAll = async(req,res)=>{
  try {
    const users = await User.find({ _id: { $ne: req.params.userId } }).select('_id username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = { Userregister, userLogin,getAll};




