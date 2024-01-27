import { Request, Response } from "express"

import { User } from "@prisma/client"
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { json } from "stream/consumers";

interface AuthRequest extends Request {
    user: User;
}
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        return await prismaClient.$transaction(async (tx) => {
            const cartItems = await tx.cartItem.findMany({
                where: {
                    userId: req.user.id
                },
                include: {
                    product: true
                }
            });

            if (cartItems.length === 0) {
                return res.json({ message: "Cart is empty" });
            }

            let address = null;

            // Check if req.user.defaultShippingAddress is truthy before querying the database
            if (req.user.defaultShippingAddress) {
                address = await tx.address.findFirst({
                    where: {
                        id: req.user.defaultShippingAddress
                    }
                });
            }
            const total = cartItems.reduce((prev, current) => {
                return prev + (current.quantity * +current.product.price);
            }, 0);
            const order = await tx.order.create({
                data: {
                    userId: req.user.id,
                    netAmount: total,
                    address: address?.formatedAddress || "Default Address", // Provide a default value if null
                    products: {
                        create: cartItems.map((cart) => {
                            return {
                                productId: cart.productId,
                                quantity: cart.quantity
                            };
                        })
                    }
                }
            });
            const orderEvent = await tx.orderEvents.create({
                data: {
                    orderId: order.id,

                }
            })
            await tx.cartItem.deleteMany({
                where: {
                    userId: req.user.id
                }
            })
            return res.json(order)
        });
    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};


export const listOrders = async (req: AuthRequest, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        },

    })
    res.json(orders)
}
export const getAllOrders = async (req: Request, res: Response) => {
    let whereClause = {

    }
    const status = req.query.status
    if (status) {
        whereClause = {
            status
        }
    }
    const limit = req.query.limit ? +req.query.limit : 10; // Number of items to show per page
    const currentPage = req.query.currentPage ? +req.query.currentPage : 1;  // Current page, defaults to 1

    const offset = (currentPage - 1) * limit;

    const total = await prismaClient.product.count();
    const totalPages = Math.ceil(total / limit);

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: offset,
        take: limit

    })
    res.json(orders)
}


export const updateOrder = async (req: AuthRequest, res: Response) => {

}
export const cancelOrder = async (req: AuthRequest, res: Response) => {



    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: 'CANCELLED'
            }
        })
        await prismaClient.orderEvents.create({
            data: {
                orderId: order.id,
                status: "CANCELLED"
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND)
    }
}
export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getUserOrders = async (req: AuthRequest, res: Response) => {
    let whereClause: any = {
        userId: +req.params.id
    }
    const status = req.query.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const limit = req.query.limit ? +req.query.limit : 10; // Number of items to show per page
    const currentPage = req.query.currentPage ? +req.query.currentPage : 1;  // Current page, defaults to 1

    const offset = (currentPage - 1) * limit;

    const total = await prismaClient.product.count();
    const totalPages = Math.ceil(total / limit);

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: offset,
        take: limit

    })
    res.json({
        data: orders,
        limit,
        total,
        totalPages,
        currentPage
    });
}

export const changeOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const order = await prismaClient.order.update({
            where: {
                id: +req.params.id
            },
            data: {
                status: req.body.status
            }
        })
        await prismaClient.orderEvents.create({
            data: {
                orderId: order.id,
                status: req.body.status
            }
        })
        res.json(order)
    } catch (err) {
        throw new NotFoundException("Order not found!", ErrorCode.ORDER_NOT_FOUND)
    }
}