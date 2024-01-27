import { Router } from 'express'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'
import { changeUserRole, createAddress, deleteAddress, getAddressById, getAddresses, getUserById, getUsers, updateAddress, updateUser } from '../controllers/users'
import isAdmin from '../middlewares/isAdmin'


const usersRoutes: Router = Router()

usersRoutes.put('/', [authMiddleware], errorHandler(updateUser))

usersRoutes.get('/address', errorHandler(getAddresses))
usersRoutes.get('/address/:id', errorHandler(getAddressById))
usersRoutes.post('/address', [authMiddleware], errorHandler(createAddress))
usersRoutes.put('/address/:id', [authMiddleware], errorHandler(updateAddress))
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress))

usersRoutes.put('/:id/role', [authMiddleware, isAdmin], errorHandler(changeUserRole))
usersRoutes.get('/', [authMiddleware, isAdmin], errorHandler(getUsers))
usersRoutes.get('/:id', [authMiddleware, isAdmin], errorHandler(getUserById))






export default usersRoutes