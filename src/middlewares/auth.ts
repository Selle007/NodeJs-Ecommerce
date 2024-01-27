import { NextFunction, Request, Response, RequestHandler } from "express";

import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

interface AuthRequest extends Request {
    user?: User;
}

const authMiddleware: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token: any = req.headers.authorization

    if (!token) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any

        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } })

        if (!user) {
            next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
    }
}

export default authMiddleware;
