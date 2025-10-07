import MemberService from "../models/Member.service";
import { T } from "../libs/types/common";
import express, { Request, Response } from "express";

const memberService = new MemberService(); //getting instance from Member Service

const adminController: T = {};

//HOME
adminController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
    res.redirect("/admin");
  }
};

//SIGNUP
adminController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("adminController: getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
    res.redirect("/admin");
  }
};

adminController.processSignup = async (req: Request, res: Response) => {
  console.log("processSignup");
  res.send("HELLO SIGNUP");
};

//LOGIN
adminController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin", err);
    res.redirect("/admin");
  }
};

adminController.processLogin = (req: Request, res: Response) => {
  console.log("processLogin");
  res.send("HELLO LOGIN");
};

export default adminController;
