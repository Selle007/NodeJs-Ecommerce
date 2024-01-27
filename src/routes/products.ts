import { Router } from 'express'
import { createProduct } from '../controllers/products'
import { errorHandler } from '../errorHandler'


const productsRoutes: Router = Router()

productsRoutes.post('/', errorHandler(createProduct))
// productsRoutes.post('/login', errorHandler(login))
// productsRoutes.get('/profile', [authMiddleware], errorHandler(profile))



export default productsRoutes