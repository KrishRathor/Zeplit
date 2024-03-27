import { z } from "zod";
import { createTRPCRouter, isUserAuthenticated, publicProcedure } from "../trpc";
import { HttpStatusCode } from "../HttpStatusCode";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const kapsRouter = createTRPCRouter({
    createKap: publicProcedure
        .input(z.object({
            title: z.string(),
            token: z.string(),
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { title, token } = opts.input;

            try {
                
                return {
                    title,
                    token
                }

            } catch (error) {
                console.log(error);
                return {
                    code: HttpStatusCode.InternalServerError,
                    message: 'internal server error',
                    kap: null
                }
            } finally {
                await prisma.$disconnect();
            }

        })
})