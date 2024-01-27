import { Router } from 'express'
import { login, profile, register } from '../controllers/auth'
import { errorHandler } from '../errorHandler'
import authMiddleware from '../middlewares/auth'

const authRoutes: Router = Router()

authRoutes.post('/register', errorHandler(register))
authRoutes.post('/login', errorHandler(login))
authRoutes.get('/profile', [authMiddleware], errorHandler(profile))



export default authRoutes