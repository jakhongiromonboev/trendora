import { T } from "../libs/types/common";
import express, { Request, Response } from "express";

const adminController: T = {};

adminController.processSignup = async (req: Request, res: Response) => {
  console.log("adminController.processSignup");
  res.send("HELLO");
};

export default adminController;
