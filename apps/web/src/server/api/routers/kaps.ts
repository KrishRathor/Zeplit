import { z } from "zod";
import { createTRPCRouter, isUserAuthenticated, publicProcedure } from "../trpc";
import { HttpStatusCode } from "../HttpStatusCode";
import { PrismaClient } from "@prisma/client";
import { waitForAll } from "recoil";

const prisma = new PrismaClient();

export const kapsRouter = createTRPCRouter({
    createKap: publicProcedure
        .input(z.object({
            title: z.string(),
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { title } = opts.input;
            const { username } = opts.ctx;

            try {
                
                const user = await prisma.user.findFirst({
                    where: {
                        username: username
                    }
                })

                if (!user) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'user not found',
                        kap: null
                    }
                }

                const createKap = await prisma.kap.create({
                    data: {
                        title: title,
                        owner: user.username
                    }
                })

                return {
                    code: HttpStatusCode.Created,
                    message: 'new cap created',
                    kap: createKap
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

        }),
    togglePublishStatusOfKap: publicProcedure
        .input(z.object({
            id: z.number(),
            published: z.boolean()
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { id, published } = opts.input;
            const { username } = opts.ctx;

            try {
                
                const user = await prisma.user.findFirst({
                    where: {
                        username: username
                    }
                })

                if (!user) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'user not found',
                        kap: null
                    }
                }

                const updateKap = await prisma.kap.update({
                    where: {
                        id: id
                    },
                    data: {
                        published: published
                    }
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'updated kap',
                    kap: updateKap
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
        }),
    getAllKapsOfUser: publicProcedure
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { username } = opts.ctx;

            try {
                
                const user = await prisma.user.findFirst({
                    where: {
                        username: username
                    }
                })

                if (!user) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: 'user not found',
                        kaps: null
                    }
                }

                const getKaps = await prisma.kap.findMany({
                    where: {
                        owner: username
                    }
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'got kaps',
                    kaps: getKaps
                }

            } catch (error) {
                console.log(error);
                return {
                    code: HttpStatusCode.InternalServerError,
                    message: 'internal server error',
                    kaps: null
                }
            } finally {
                await prisma.$disconnect();
            }
        })
})