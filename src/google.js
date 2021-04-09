/*
 *  Entryfile of Google plugin for ganitra.
 *  Created On 09 April 2021
 */

import google from './routes/google/index.js'

export const modules = []
export const tasks = []
export const routes = [google]

export { default as config } from './config.js'
