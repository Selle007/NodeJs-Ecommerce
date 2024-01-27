import express, { Express, Request, Response, query } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import { registerSchema } from './schema/users';
const app: Express = express()

app.use(express.json())
app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
    log: ["query"]
}).$extends({
    result: {
        address: {
            formatedAddress: {
                needs: {
                    lineOne: true,
                    // lineTwo: true,
                    city: true,
                    country: true,
                    zipCode: true,
                },
                compute: (addr) => {
                    return `Address: ${addr.lineOne}, City: ${addr.city}, Country: ${addr.country}, ZipCode: ${addr.zipCode}`
                }
            }
        }
    }
})
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}!`);
})