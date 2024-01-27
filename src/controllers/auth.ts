import { NextFunction, Request, Response } from "express"
import { prismaClient } from "..";
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequest";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { registerSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { User } from "@prisma/client";

interface AuthRequest extends Request {
    user?: User;
}


export const register = async (req: Request, res: Response, next: NextFunction) => {
    registerSchema.parse(req.body)
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } })
    if (user) {
        new BadRequestsException("User already exists!", ErrorCode.USER_EXISTS)
    }
    user = await prismaClient.user.create(
        {
            data: {
                name,
                email,
                password: hashSync(password, 10)

            }
        }
    )
    res.json(user)
}


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } })
    if (!user) {
        throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND)
    }
    if (!compareSync(password, user.password)) {
        throw new NotFoundException("Incorrect password!", ErrorCode.INCORRECT_PASSWORD)
    }
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)



    res.json({ user, token })
}


export const profile = async (req: AuthRequest, res: Response) => {
    res.json(req.user);
};