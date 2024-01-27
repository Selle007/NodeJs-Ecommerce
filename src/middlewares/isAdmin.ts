import { NextFunction, Request, Response, RequestHandler } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { User } from "@prisma/client";

interface AuthRequest extends Request {
    user?: User;
}

const isAdmin: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user: any = req.user
    if (user.role == 'ADMIN') {
        next()
    }
    else {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))

    }
}

export default isAdmin;
