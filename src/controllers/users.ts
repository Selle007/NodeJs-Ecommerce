import { Address, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { addressSchema, updateUserSchema } from "../schema/users";

import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/badRequest";


interface AuthRequest extends Request {
    user: User;
}

export const updateUser = async (req: AuthRequest, res: Response) => {
    const validatedData: any = updateUserSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })

        } catch (err) {
            throw new NotFoundException("Address not found.", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestsException("Address does not belong to user!", ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })

        } catch (err) {
            throw new NotFoundException("Address not found.", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (billingAddress.userId != req.user.id) {
            throw new BadRequestsException("Address does not belong to user!", ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validatedData
    })
    res.json(updatedUser)

}


export const getAddresses = async (req: AuthRequest, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user.id
        }
    })
    res.json(addresses)
};

export const getAddressById = async (req: AuthRequest, res: Response) => {
    res.json(req.user);
};

export const createAddress = async (req: AuthRequest, res: Response) => {
    addressSchema.parse(req.body)


    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })
    res.json(address)
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
    res.json(req.user);
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
    try {
        await prismaClient.address.delete({
            where:
            {
                id: +req.params.id
            }
        })
        res.json({ success: true })
    } catch (err) {
        throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND)
    }
};

export const getUsers = async (req: Request, res: Response) => {

    const limit = req.query.limit ? +req.query.limit : 10; // Number of items to show per page
    const currentPage = req.query.currentPage ? +req.query.currentPage : 1;  // Current page, defaults to 1

    const offset = (currentPage - 1) * limit;

    const total = await prismaClient.product.count();
    const totalPages = Math.ceil(total / limit);

    const users = await prismaClient.user.findMany({
        skip: offset,
        take: limit
    })

    res.json({
        data: users,
        limit,
        total,
        totalPages,
        currentPage
    })
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true,
                Order: true
            }
        })
        res.json(user)
    } catch (err) {
        throw new NotFoundException("User does not exist.", ErrorCode.USER_NOT_FOUND)
    }
};

export const changeUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prismaClient.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: req.body.role
            }

        })
        res.json(user)
    } catch (err) {
        throw new NotFoundException("User does not exist.", ErrorCode.USER_NOT_FOUND)
    }
};





