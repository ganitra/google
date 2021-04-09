/*
 *  This file will validate the configuration given be the user
 *  Created On 09 April 2021
 */

export default Joi =>
    Joi.object({
        auth: Joi.object({
            id: Joi.string().length(72).required(),
            secret: Joi.string().length(24).required(),
            redirect: Joi.string().uri().required(),
        }),
        youtube: Joi.object({
            channel: Joi.string().length(24),
        }),
    })
