import { Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/notFound"
import { ErrorCode } from "../exceptions/root"


export const getProducts = async (req: Request, res: Response) => {
    const limit = req.query.limit ? +req.query.limit : 10; // Number of items to show per page
    const currentPage = req.query.currentPage ? +req.query.currentPage : 1;  // Current page, defaults to 1

    const offset = (currentPage - 1) * limit;

    const total = await prismaClient.product.count();
    const totalPages = Math.ceil(total / limit);

    const products = await prismaClient.product.findMany({
        skip: offset,
        take: limit
    });

    res.json({
        data: products,
        limit,
        total,
        totalPages,
        currentPage
    });
}
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    } catch (err) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)

    }
}
export const createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })
        res.json(updatedProduct)
    } catch (err) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}
export const deleteProduct = async (req: Request, res: Response) => {

}


export const searchProducts = async (req: Request, res: Response) => {
    // Obtain the search string from the request
    const limit = req.query.limit ? +req.query.limit : 10; // Number of items to show per page
    const currentPage = req.query.currentPage ? +req.query.currentPage : 1;  // Current page, defaults to 1

    const offset = (currentPage - 1) * limit;

    const total = await prismaClient.product.count();
    const totalPages = Math.ceil(total / limit);
    const searchString: string = req.query.q as string;

    // Perform the full-text search using Prisma
    try {
        const searchResults = await prismaClient.product.findMany({
            where: {
                OR: [
                    { name: { contains: searchString } },
                    { description: { contains: searchString } },
                    { tags: { contains: searchString } },
                ],
            },
            skip: offset,
            take: limit
        });

        // Send the search results in the response
        res.status(200).json({
            data: searchResults,
            limit,
            total,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error('Error performing full-text search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

