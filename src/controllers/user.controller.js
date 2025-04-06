import { asynchandler } from "../utils/asynchandler.js";
import { apierrors } from "../utils/apierrors.js";
import { User } from "../models/user.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { apiresponse } from "../utils/apiresponse.js";


const generateAccesstokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshtoken();

    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apierrors(
      500,
      "something went wrong while generating access token and refresh token"
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  //get a user detailed
  //validation
  //check if user already exits
  //check for images,check for avtar
  //upload them to cloudinery
  //create user object -create entry in db
  //remove passeord and refresh toke field from response
  //check for user creation
  //return res
  const { fullName, userName, email, password } = req.body;
  console.log("email :", email);
  if (
    [fullName, email, userName, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new apierrors(400, "all fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new apierrors("user with email or username is already exist");
  }
  console.log(req.files);

  const avatarlocalpath = req.files?.avatar[0]?.path;
  // const coverImagelocalpath=req.files?.coverImage[0]?.path
  let coverImagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalpath = req.files.coverImage[0].path;
  }

  if (!avatarlocalpath) {
    throw new apierrors(400, "avatar is required");
  }

  const avatar = await uploadoncloudinary(avatarlocalpath);
  const coverImage = await uploadoncloudinary(coverImagelocalpath);

  if (!avatar) {
    throw new apierrors(400, "avatar file is required");
  }

  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createduser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createduser) {
    throw new apierrors(500, "something went wrong while regester user");
  }
});

const loginUser = asynchandler(async (req, res) => {
  //req.body-> data
  //userName or email
  //check user exist
  //check password
  //generate access token and refresh token
  //send cookie

  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new apierrors(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new apierrors(400, "user not found");
  }

  const ispasswordvalid = await user.ispasswordcorrect(password);
  if (!ispasswordvalid) {
    throw new apierrors(400, "password is not valid");
  }

  const { accessToken, refreshToken } =
    await generateAccesstokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
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
    .json(
      new apiresponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
        "user logged in successfully"
      )
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken:undefined},
    
  },
{
  new: true
});
const options = {
  httpOnly: true,
  secure: true,
};
return res
  .status(200)
  .cookie("refreshToken",options)
  .cookie("accessToken",options)
  .json(new apiresponse(200, {}, "user logged out successfully"));


})

const refreshAccessToken=asynchandler(async (req, res) => {
  const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingrefreshtoken) {
    throw new apierrors(401, "unauthorized request");
  }
  try {
    const decodedToken= jwt.verify(incomingrefreshtoken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
  
    if (!user) {
      throw new apierrors(401, "invalid refresh token");
    }
    if (incomingrefreshtoken !== user?.refreshToken) {
      throw new apierrors(401, " refresh token id expired or used");
    }
  
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } = await generateAccesstokenAndRefreshToken(user._id);
    return res
    .status(200)
    .cookie("refreshToken", newrefreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new apiresponse(200, {accessToken,refreshToken:newrefreshToken}, "access token refreshed"));
  } catch (error) {
    throw new apierrors(401,Error?.message || "invalid refresh token");
    
  }

})
  

export { registerUser, loginUser,logoutUser,refreshAccessToken };
