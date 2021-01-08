/**
 *  * Created by Wilton O. Ferreira on 14/05/2020
 */

import * as Joi from "joi";

export abstract class GenericValidator {

    static responsePostPutAndDelete = Joi.object().keys({
        message: Joi.string().required(),
        description: Joi.string().required(),
        code: Joi.number().required()
    });

    static byId = Joi.object().keys({
        id: Joi.string().max(999999).required()
    });

    static byKey = Joi.object().keys({
        key: Joi.string().max(999999).required()
    });


    static jwtValidator = Joi.object({'authorization': Joi.string().required().default(process.env.TOKEN)}).unknown();
    static jwtValidatorQuery = Joi.object({'token': Joi.string().required()}).unknown();

    static requestLanguageAndIdCode = Joi.object().keys({
        languageCode: Joi.string().required().default('pt'),
        id: Joi.string().max(9999999).required()
    });

    static paginationInput = Joi.object().keys({
        offset: Joi.number().max(999999).allow(null).optional(),
        limit: Joi.number().max(999999).allow(null).optional(),
        search: Joi.string().allow(null).allow('').optional(),
    });

    static paginationOnlyInput = Joi.object().keys({
        offset: Joi.number().max(999999).allow(null).optional(),
        limit: Joi.number().max(999999).allow(null).optional()
    });

    static postPayload = Joi.object().keys({
    });

    static putPayload = Joi.object().keys({
        id: Joi.string().max(999999).required()
    });

    static getById = Joi.object().keys({
        id: Joi.string().max(999999).allow(null).allow(''),
        createAt: Joi.date().allow(null).allow(''),
        updateAt: Joi.date().allow(null).allow(''),
        deletedAt: Joi.date().allow(null).allow('')
    }).allow(null);

    static getList = Joi.array().items(Joi.object().keys({
        id: Joi.string().max(999999).allow(null).allow(''),
        createAt: Joi.date().allow(null).allow(''),
        updateAt: Joi.date().allow(null).allow(''),
        deletedAt: Joi.date().allow(null).allow('')
    })).allow(null);

}
