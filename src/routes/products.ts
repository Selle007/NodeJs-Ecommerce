import { Router } from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, searchProducts, updateProduct } from '../controllers/products'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'
import isAdmin from '../middlewares/isAdmin'


const productsRoutes: Router = Router()
productsRoutes.get('/search', errorHandler(searchProducts))
productsRoutes.get('/', errorHandler(getProducts))
productsRoutes.get('/:id', errorHandler(getProductById))
productsRoutes.post('/', [authMiddleware, isAdmin], errorHandler(createProduct))
productsRoutes.put('/:id', [authMiddleware, isAdmin], errorHandler(updateProduct))
productsRoutes.delete('/:id', [authMiddleware, isAdmin], errorHandler(deleteProduct))





export default productsRoutes