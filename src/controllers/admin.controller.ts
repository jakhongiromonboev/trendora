import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import { NextFunction, Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import {
  AdminRequest,
  LoginInput,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

const memberService = new MemberService(); //getting instance from Member Service

const adminController: T = {};

//HOME
adminController.goHome = (req: AdminRequest, res: Response) => {
  try {
    console.log("goHome");
    res.render("home", { member: req.session?.member || null });
  } catch (err) {
    console.log("Error, goHome:", err);
    res.redirect("/admin");
  }
};

//SIGNUP
adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
    res.redirect("/admin");
  }
};

adminController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
    }

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path;
    newMember.memberType = MemberType.ADMIN;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/dashboard");
    });

    console.log("result:", result);
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/signup")</script>`
    );
  }
};

//LOGIN
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin", err);
    res.redirect("/admin/dashboard");
  }
};

adminController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/dashboard");
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/login")</script>`
    );
  }
};

adminController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error,logout", err);
    res.redirect("/admin");
  }
};

//ADMIN --> DASHBOARD

adminController.goDashboard = (req: AdminRequest, res: Response) => {
  try {
    console.log("goDashboard");
    res.render("dashboard");
  } catch (err) {
    console.log("Error, goDashboard");
    res.redirect("/admin");
  }
};

//ADMIN --> USERS
adminController.getAllUsers = async (req: AdminRequest, res: Response) => {
  try {
    console.log("getAllUsers");
    const result = await memberService.getAllUsers();
    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, getAllUsers", err);
    res.redirect("/admin/login");
  }
};

adminController.updateMemberByAdmin = async (req: Request, res: Response) => {
  try {
    console.log("updateMemberByAdmin");
    const result = await memberService.updateMemberByAdmin(req.body);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error,updateMemberByAdmin ");
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

//UPDATE ADMIN PROFILE
adminController.getAdminProfilePage = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("getAdminProfilePage");
    const admin = req.session.member;
    res.render("admin-info", { admin });
  } catch (err) {
    console.log("Error, getAdminProfilePage", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

adminController.updateAdminInfo = async (req: AdminRequest, res: Response) => {
  try {
    console.log("updateAdminInfo");
    const input: MemberUpdateInput = req.body;
    if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");
    const result = await memberService.updateAdminInfo(req.member, input);
    req.session.member = result;

    req.session.save((err) => {
      if (err) {
        console.error("Error, session save error!");
        return res
          .status(HttpCode.INTERNAL_SERVER_ERROR)
          .json(Message.SOMETHING_WENT_WRONG);
      }
      res.status(HttpCode.OK).json({ data: result });
    });
  } catch (err) {
    console.log("Error, updateAdminInfo", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** CHECKING AUTHENTICATION OF ADMIN **/
adminController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) {
      res.send(`<script>alert("Hi,${req.session.member.memberNick}")</script>`);
    } else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession");
  }
};

adminController.verifyAdmin = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("verifyAdmin");
  if (req.session?.member?.memberType === MemberType.ADMIN) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script>alert("${message}"); window.location.replace("/admin/login")</script>`
    );
  }
};

export default adminController;
