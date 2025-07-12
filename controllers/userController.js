import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // 1step  check if the  all field is provided or not
    if (!username || !email || !password) {
      throw new Error("please provide all input field");
    }
    // 2nd  if the email is olready in used or user is olready exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send("User already exists");
      return;
    }
    //  no user
    // 3rd  hash the   password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const newUser = User({username:username,email:email,password:hashedPassword})
    const newUser = User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken(res, newUser._id);
    return res.status(201).json({
      message: `${newUser.username} you Register successfully..✔️`,
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: token,
    });
  } catch (err) {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

// login ---->

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existUser = await User.findOne({ email });
  // console.log(existUser);
  if (!existUser) {
    return res.status(400).json({
      message: "user not exists please register  ......",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, existUser.password);
  if (isPasswordValid) {
    const token = generateToken(res, existUser._id);
    return res.status(201).json({
      message: `${existUser.username} You  login successfully✔️`,
      _id: existUser._id,
      username: existUser.username,
      email: existUser.email,
      isAdmin: existUser.isAdmin,
      token: token,
    });
  }
});

//   logout ----->
export const logout = asyncHandler(async (req, res) => {
  //    set the cookie emppty
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: ` You Logged out successfully` });
});

//   get all users ---->   Admin can  have access
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  console.log("users--------", users);
  return res.status(200).json({
    message: "all user fetched successfully",
    usersData: users,
  });
});

// get user by id ---> Admin  can have access
export const getuserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    return res.status(200).json({
      message: ` ${user.username} Your profile updated successfully`,
      updatedProfile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

//this dispaly the current Logedin user profile
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

//   update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
  }
  const updatedUser = await user.save();
  console.log("updated user -->", updatedUser);
  const token = generateToken(res, updatedUser._id);
  return res.status(200).json({
    message: `${updatedUser.username} Your Profile Updated successfully...✔️`,
    updatedProfile: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
      isAdmin: updatedUser.isAdmin,
      token: token,
    },
  });
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  // req.user._id --> come from jwt    login user ki
  const user = await User.findById(req.user._id);
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
  }
  const updatedUser = await user.save();
  console.log("updated user -->", updatedUser);
  const token = generateToken(res, updatedUser._id);
  return res.status(200).json({
    message: `${updatedUser.username} Your Profile Updated successfully...✔️`,
    updatedProfile: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
      isAdmin: updatedUser.isAdmin,
      token: token,
    },
  });
});

//   delete user by id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res
      .status(404)
      .json({ message: "user is not exists provied valid userid" });

  if (user.isAdmin) {
    return res
      .status(500)
      .json({ message: `${user.username} is the Admin can't deleted` });
  }
  await User.deleteOne({ _id: user._id });
  return res.status(200).json({
    message: `${user.username} deleted successfully `,
  });
});
