/*
 *  Takes a callback from Google and saves the authentication keys.
 *  Created On 09 April 2021
 */

import dirname from 'es-dirname'
import fs from 'fs/promises'
import { google } from 'googleapis'
import Joi from 'joi'
import path from 'path'

const SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
]

const handler = async ({ query, server: { app } }, h) => {
    const { config, data } = app
    const OAuth2 = google.auth.OAuth2

    const oauth2Client = new OAuth2({
        clientId: config.google.config.auth.id,
        clientSecret: config.google.config.auth.secret,
        redirectUri: config.google.config.auth.redirect,
    })

    // if code get access, and refresh tokens
    // and store
    if (query.code) {
        const {
            tokens: { access_token, refresh_token },
        } = await oauth2Client.getToken(query.code)

        // save in our data
        data.set('youtube.access', access_token)
        data.set('youtube.refresh', refresh_token)

        return await fs.readFile(path.join(dirname(), 'public', 'index.html'), {
            encoding: 'utf-8',
        })
    } else {
        // generate a new auth URL and redirect
        const endpoint = oauth2Client.generateAuthUrl({
            scope: SCOPES,
            access_type: 'offline',
        })

        return h.redirect(endpoint).temporary()
    }
}

export default {
    handler,
    method: 'GET',
    path: '/g00gle',
    options: {
        validate: {
            query: Joi.object({
                code: Joi.string().default(null),
                scope: Joi.string(),
            }),
        },
    },
}
