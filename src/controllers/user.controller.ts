import { Request, Response } from "express";
import User, { IUser} from "../models/user.model";

const createUser = async (req:Request, res:Response) => {
    try {
        const payload = req.body;
        const user = await User.findOne({email:payload.email});
        if(!user){
            const newUser = new User({
                userName: payload.userName,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email
            });
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully.!",
            });
        }else{
            return res.status(422).json({
                message: "User already exists.!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Ooops!, Internal server error",
            error
        });
    }
};

const getUsers = async (req:Request, res:Response) => {
    try{
        const users = await User.find({},{password:0, __v:0, lastLogin:0, createdAt:0, updatedAt:0});
        if(users.length){
            return res.status(200).json({
                message: "success",
                data: users
            });
        }else{
            return res.status(200).json({
                message: "No data available.!",
                data: []
            });
        }
    }catch(error){
        return res.status(500).json({
            message: "Ooops!, Internal server error",
            error
        });
    }
};

export default {
    createUser,
    getUsers
};