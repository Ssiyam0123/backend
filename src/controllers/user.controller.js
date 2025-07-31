import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/video-model/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import generateAccessTokenAndRefreshToken from "../utils/generateAccessTokenAndRefreshToken.js";
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if (!password && (!userName || !email)) {
    throw new ApiError(400, "email or username and password is requied");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(404, "invailid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "user logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
  const cookieUser = req.user;
  await User.findByIdAndUpdate(
    cookieUser?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
   if (!incommingAccessToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  const decodedToken = jwt.verify(incommingRefreshToken, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized access");
  }

  if (incommingRefreshToken !== user.accessToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("refreshToken", refreshToken, option)
  .cookie("accessToken", accessToken, option)
  .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed successfully"));
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
