import { Router } from "express";
import {
  changecurrentpassword,
  currentuser,
  getuserChannelProfile,
  getwatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountdetails,
  updatecoverImage,
  updateuserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser, verifyJWT);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changecurrentpassword);
router.route("/current-user").get(verifyJWT, currentuser);
router.route("/update-account").patch(verifyJWT, updateAccountdetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateuserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updatecoverImage);

router.route("/c/:username").get(verifyJWT, getuserChannelProfile);
router.route("/history").get(verifyJWT, getwatchHistory);

export default router;
