import { Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/notFound"
import { ErrorCode } from "../exceptions/root"
import { changeQuantitySchema, createCartSchema } from "../schema/cart"
import { Product, User } from "@prisma/client"

interface AuthRequest extends Request {
    user: User;
}

export const addItemToCart = async (req: AuthRequest, res: Response) => {
    const validatedData = createCartSchema.parse(req.body)
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (err) {
        throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {

    await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    })
    res.json({ success: true })

}

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = changeQuantitySchema.parse(req.body)
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)
}

export const getCart = async (req: AuthRequest, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)
}


