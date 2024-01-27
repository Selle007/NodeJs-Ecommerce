import { Router } from 'express'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from '../controllers/carts'


const cartsRoutes: Router = Router()

cartsRoutes.get('/', [authMiddleware], errorHandler(getCart))
cartsRoutes.post('/', [authMiddleware], errorHandler(addItemToCart))
cartsRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity))
cartsRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart))




export default cartsRoutes