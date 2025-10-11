//REACT
import express from "express";
import memberController from "./controllers/member.controller";
const router = express.Router();
import uploader from "./libs/utils/uploader";

/** MEMBER **/
router.post("/member/signup", memberController.signup);
router.post("/member/login", memberController.login);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);

router.get("/member/top-users", memberController.getTopUsers);

/** PRODUCT **/

/** ORDER **/

export default router;
