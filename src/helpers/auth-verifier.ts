import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

const verifier = (req: Request, res:Response, next:any) => {
    if (['', undefined].includes(req.headers.authorization)) {
        res.status(401).json({
            "msg":"Not Authorized, Token Required.!"
        });
    } else {
        try{
            const bearerToken = req.headers.authorization;
            jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        "msg":"Not Authorized, Token Expired.!"
                    });
                } else {
                    next();
                }
            });
        }catch(error){
            return {
                message: "Ooops!, Authentication Error",
                error
            };
        }
    }
}

export default {
    verifier
};
