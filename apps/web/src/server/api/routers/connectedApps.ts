import { z } from "zod";
import { createTRPCRouter, isUserAuthenticated, publicProcedure } from "../trpc";
import { google } from "googleapis"
import { HttpStatusCode } from "../HttpStatusCode";
import { PrismaClient } from "@prisma/client";

const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.OauthClientID,
    clientSecret: process.env.OauthClientSecret,
    redirectUri: process.env.RedirectURI
})

const prisma = new PrismaClient();

export const connectedAppsRouter = createTRPCRouter({
    gmailConnect: publicProcedure
        .input(z.object({
            
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://mail.google.com/']
            })

            return {
                code: HttpStatusCode.OK,
                message: 'url generated',
                url: authUrl
            }
        }),
    getAuthCode: publicProcedure
        .input(z.object({
            code: z.string()
        }))
        .use(isUserAuthenticated)
        .mutation(async opts => {
            const { code } = opts.input;  
            const { username } = opts.ctx;    
            const { tokens } = await oauth2Client.getToken(code);
            console.log(code, tokens);
            const { access_token, refresh_token } = tokens;

            const user = await prisma.user.findFirst({
                where: {
                    username: username
                }
            })

            if (!user) {
                return {
                    code: HttpStatusCode.NotFound,
                    message: 'User not found'
                }
            }

            const userGoogleToken = await prisma.userGoogleToken.findFirst({
                where: {
                    username: username
                }
            })

            if (!userGoogleToken && access_token && refresh_token) {
                const createUserGoogleToken = await prisma.userGoogleToken.create({
                    data: {
                        username: username,
                        accessToken: access_token,
                        refreshToken: refresh_token
                    }
                })
            }

            oauth2Client.setCredentials({
                access_token: access_token,
                refresh_token: refresh_token
            })

        })
})