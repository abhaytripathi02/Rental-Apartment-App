import type { NextFunction, Request,Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";


interface DecodedToken extends JwtPayload{
    sub : string;
    "custom:role"?: string;
}

declare global{
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role?: string;
            };
        }
    }
}

export const authMiddleware = (allowedRoles: string[]) =>{
        return (req:Request, res:Response, next:NextFunction): void => {

            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                res.status(401).json({ message: "Unauthorized Access" });
                return;
            }

            try{
                const decoded = jwt.decode(token) as DecodedToken;
                const userRole = decoded["custom:role"] || "";
                // set the user object in the request. This is useful for later use in the application
                req.user = {
                    id: decoded.sub,
                    role: userRole
                }
                console.log("Allowed Roles:", allowedRoles);
                const hasAccess = allowedRoles.includes(userRole.toLowerCase());
                if (!hasAccess) {
                    res.status(403).json({ message: "Access Denied" });
                    return;
                }

            }catch (error) {
                console.error("Token verification failed:", error);
                res.status(401).json({ message: "Invalid token" });
                return;
            }

            // If everything is fine, proceed to the next middleware
            next();
        }
}