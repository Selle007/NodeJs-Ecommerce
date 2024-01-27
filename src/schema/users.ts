import { z } from 'zod'

export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const addressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    zipCode: z.string().length(5),
    city: z.string(),
    country: z.string(),
})

export const updateUserSchema = z.object({
    name: z.string().optional(),
    defaultShippingAddress: z.number().optional(),
    defaultBillingAddress: z.number().optional(),
})