import { Router } from 'express'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'
import { cancelOrder, createOrder, getAllOrders, getOrderById, listOrders, updateOrder, getUserOrders, changeOrderStatus } from '../controllers/orders'
import isAdmin from '../middlewares/isAdmin'


const ordersRoutes: Router = Router()

ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder))
ordersRoutes.put('/:id', [authMiddleware], errorHandler(updateOrder))
ordersRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get('/index', [authMiddleware, isAdmin], errorHandler(getAllOrders))
ordersRoutes.get('/users/:id', [authMiddleware], errorHandler(getUserOrders))
ordersRoutes.put('/:id/status', [authMiddleware, isAdmin], errorHandler(changeOrderStatus))

ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))





export default ordersRoutes