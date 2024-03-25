import { z } from "zod";
import jwt from 'jsonwebtoken';
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from "../HttpStatusCode";

const prisma = new PrismaClient();

const secret = 'Se3rEt';

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust the salt rounds as per your requirement
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
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
        }),

        signin: publicProcedure
            .input(z.object({
                email: z.string(),
                password: z.string()
            }))
            .mutation(async opts => {
                const { email, password } = opts.input;

                try {

                    const user = await prisma.user.findFirst({
                        where: {
                            email: email
                        }
                    })

                    if (!user) {
                        return {
                            code: HttpStatusCode.NotFound,
                            message: 'User Not Found',
                            user: user,
                            token: null
                        }
                    }

                    const passwordMatched = await comparePasswords(password, user.password);

                    if (!passwordMatched) {
                        return {
                            code: HttpStatusCode.BadRequest,
                            message: 'Incorrect password',
                            user: null,
                            token: null
                        }
                    }

                    const payload = {
                        email: user.email,
                        username: user.username,
                        user: null,
                        token: null
                    }

                    const token = jwt.sign(payload, secret);

                    return {
                        code: HttpStatusCode.Accepted,
                        message: 'User and password matched',
                        user: null,
                        token: token
                    }
    

                } catch (error) {
                    console.log(error);
                    return {
                        code: HttpStatusCode.InternalServerError,
                        message: 'Internal Server Error',
                        user: null,
                        token: null
                    }
                } finally {
                    await prisma.$disconnect();
                }
            })
})