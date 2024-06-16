import { Router } from "express";
import jwt from "jsonwebtoken";
import { sample_users } from "../data";
import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user.model";

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
       const usersCount = await UserModel.countDocuments();
       if(usersCount> 0){
         res.send("A seedelés már megtörtént!");
         return;
       }
   
       await UserModel.create(sample_users);
       res.send("A seedelés sikeres volt!");
   }
))

router.post("/login", asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({email, password});
    
       if(user) {
        res.send(generateTokenResponse(user));
       }
       else{
        const BAD_REQUEST = 400;
        res.status(BAD_REQUEST).send("Helytelen email vagy jelszó!");
       }
    
    }
))

const generateTokenResponse = (user: any) => {
    const token = jwt.sign({
        email: user.email,
        isAdmin: user.isAdmin
    }, "Text", {
        expiresIn: "30d"
    });
    user.token = token;
    return user;
}

export default router;