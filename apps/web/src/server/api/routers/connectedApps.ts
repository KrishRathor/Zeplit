import { z } from "zod";
import { createTRPCRouter, isUserAuthenticated, publicProcedure } from "../trpc";
import { google } from "googleapis"
import { HttpStatusCode } from "../HttpStatusCode";

const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.OauthClientID,
    clientSecret: process.env.OauthClientSecret,
    redirectUri: 'http://localhost:3000/getAuthCode'
})

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
        .mutation(async opts => {
            const { code } = opts.input;      
            const { tokens } = await oauth2Client.getToken(code);
            console.log(code, tokens);
            const { access_token, refresh_token } = tokens;
            oauth2Client.setCredentials({
                access_token: access_token,
                refresh_token: refresh_token
            })

            const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

                // Example: Get user's profile
            const profile = await gmail.users.getProfile({ userId: 'me' });
            console.log('User profile:', profile.data);

            return {
                profile
            }

        })
})