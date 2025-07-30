import { User } from "../model/video-model/user.model.js";
import { ApiError } from "./ApiError.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -refreshToken");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validationBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access token and refresh token");
  }
};

export default generateAccessTokenAndRefreshToken;
