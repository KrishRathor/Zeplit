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

                const kap = await prisma.kap.findFirst({
                    where: {
                        AND: [
                            { owner: username },
                            { title: title }
                        ]
                    }
                })

                if (kap) {
                    return {
                        code: HttpStatusCode.BadRequest,
                        message: 'Kap with same name exist',
                        kap: kap
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
        }),
    deleteKap: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { id } = opts.input;
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
                        message: 'User not found',
                        kap: null
                    }
                }

                const deleteKap = await prisma.kap.delete({
                    where: {
                        id: id
                    }
                })

                return {
                    code: HttpStatusCode.OK,
                    message: 'kap deleted',
                    kap: deleteKap
                }

            } catch (err) {
                console.log(err);
                return {
                    code: HttpStatusCode.InternalServerError,
                    message: 'Internal Server Error',
                    kap: null
                }
            } finally {
                await prisma.$disconnect();
            }

        }),
    getKapById: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { id } = opts.input;
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
                        message: 'User not found',
                        kap: null
                    }
                }

                const getKap = await prisma.kap.findFirst({
                    where: {
                        id: id
                    }
                })

                if (!getKap) {
                    return {
                        code: HttpStatusCode.NotFound,
                        message: `Kap with id-${id} not found`,
                        kap: null
                    }
                }

                return {
                    code: HttpStatusCode.OK,
                    message: `Kap with id-${id} found`,
                    kap: getKap
                }

            } catch (err) {
                console.log(err);
                return {
                    code: HttpStatusCode.InternalServerError,
                    message: 'Internal Server Error',
                    kap: null
                }
            } finally {
                await prisma.$disconnect();
            }
        })
})