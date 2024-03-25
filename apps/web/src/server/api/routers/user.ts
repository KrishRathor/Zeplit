import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from "../HttpStatusCode";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the salt rounds as per your requirement
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}


export const userRouter = createTRPCRouter({
    signup: publicProcedure
        .input(z.object({
            username: z.string(),
            email: z.string(),
            password: z.string().min(4)
        }))
        .mutation(async opts => {
            const { username, email, password } = opts.input;

            try {
                
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                })

                if (user) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'User already exist',
                        user: null
                    }
                }

                const hashedPassword = await hashPassword(password);

                const createUser = await prisma.user.create({
                    data: {
                        email: email,
                        username: username,
                        password: hashedPassword
                    }
                })

                if (!createUser) {
                    return {
                        code: HttpStatusCode.InternalServerError,
                        message: 'Db Not working correctly',
                        user: null
                    }
                }

                return {
                    code: HttpStatusCode.Created,
                    message: 'New User created',
                    user: createUser
                }

            } catch (error) {
                console.log(error);
                return {
                    code: HttpStatusCode.InternalServerError,
                    message: 'Internal Server Error',
                    user: null
                }
            } finally {
                await prisma.$disconnect();
            }

        })
})