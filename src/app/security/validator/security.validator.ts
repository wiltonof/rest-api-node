/**
 * Created by wilton on 18/03/2019.
 */

import * as Joi from "joi";
import {GenericValidator} from "../../../common/validator/generic.validator";



export class SecurityValidator extends GenericValidator {
    static loginUserModel = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().trim().required()
    });

    static emailOnly  = Joi.object().keys({
        username: Joi.string().required()
    });

    static rewrite = Joi.object().keys({
        password: Joi.string().required(),
        rewritePassword: Joi.string().trim().required()
    });

    static responseLoginUserModel = Joi.object().keys({
        token: Joi.string().min(1).max(4096).required(),
        username: Joi.string().min(1).max(250).required(),
        roles: Joi.array().items(Joi.object().keys({
            name: Joi.string().min(1).max(250).required(),
            description: Joi.string().min(1).max(250).required()
        })),
        permissions: Joi.array().items(Joi.object().keys({
            name: Joi.string().min(1).max(250).required(),
            description: Joi.string().min(1).max(250).required()
        }))
    });


    static responseCredentialList = Joi.array().items(Joi.object().keys({
        id: Joi.number().max(999999).required(),
        username: Joi.string().email().required(),
        role: Joi.object().keys({
            id: Joi.number().max(999999).required(),
            name: Joi.string().min(1).max(250).required(),
            description: Joi.string().min(1).max(250).required(),
            abbreviation: Joi.string().min(1).max(250).required(),
            permissions: Joi.array().items(Joi.object().keys({
                id: Joi.number().max(999999).required(),
                name:Joi.string().min(0).max(200).required(),
                description:Joi.string().min(0).max(200).required()
            }))
        })
    })).allow(null);

    static postCredential = Joi.object().keys({
        username: Joi.string().email().required(),
        password: Joi.string().min(6).max(10).required(),
        roleId: Joi.number().max(999999).required()
    });

    static putCredential = Joi.object().keys({
        id: Joi.number().max(999999).required(),
        username: Joi.string().email().required(),
        roleId: Joi.number().max(999999).required()
    });


    static responseCredentialById = Joi.object().keys({
        id: Joi.number().max(999999).required(),
        username: Joi.string().email().required(),
        role: Joi.object().keys({
            id: Joi.number().max(999999).required(),
            name: Joi.string().min(1).max(250).required(),
            description: Joi.string().min(1).max(250).required(),
            abbreviation: Joi.string().min(1).max(250).required(),
            permissions: Joi.array().items(Joi.object().keys({
                id: Joi.number().max(999999).required(),
                name:Joi.string().min(0).max(200).required(),
                description:Joi.string().min(0).max(200).required()
            }))
        })
    }).allow(null);

}

