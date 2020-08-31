import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN,10);
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req:Request, res:Response) => {
    try{
        const payload:IUser = req.body;
        const userExists = await User.findOne({ email: payload.email });
        if(userExists){
            const isPasswordCorrect = userExists.verifyPassword(payload.password, userExists.password);
            if(isPasswordCorrect){
                const token = jwt.sign({
                    userName: userExists.userName,
                    firstName: userExists.firstName,
                    lastName: userExists.lastName
                }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
                return res.status(200).json({
                    message: "success",
                    token
                });
            }else{
                return res.status(401).json({
                    message: "Incorrect password!"
                });
            }
        }else{
            return res.status(404).json({
                message: "User not exists!"
            });
        }
    }catch(error){
        return {
            message: "Ooops!, Internal server error",
            error
        };
    }
};

export default {
    login
};
