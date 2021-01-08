import * as Joi from "joi";
import {GenericValidator} from "../../../common/validator/generic.validator";


export class NotificationValidator extends GenericValidator {

    static postNotificationPayload = Joi.object().keys({
        description: Joi.string().required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        subject: Joi.string().required(),
        text: Joi.string().required(),
        html: Joi.string().required(),
        isSended: Joi.boolean().required(),
        isImediate: Joi.boolean().required(),
        notificationType: Joi.string().required()
    });

    static putNotificationPayload = Joi.object().keys({
        id: Joi.number().max(999999).optional(),
        description: Joi.string().optional(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        subject: Joi.string().required(),
        text: Joi.string().required(),
        html: Joi.string().required(),
        isSended: Joi.boolean().optional(),
        isImediate: Joi.boolean().optional(),
        notificationType: Joi.string().required()
    }).optional();

    static getNotificationById = Joi.object().keys({
        id: Joi.number().max(999999).allow(null).allow(''),
        description: Joi.string().allow(null).allow(''),
        message: Joi.string().allow(null).allow(''),
        isSended: Joi.boolean().allow(null).allow(''),
        isImediate: Joi.boolean().allow(null).allow(''),
        notificationTypeId: Joi.number().max(999999).allow(null).allow(''),
        notificationType: Joi.string().allow(null).allow('')
    }).allow(null);

    static getNotificationList = Joi.array().items(Joi.object().keys({
        id: Joi.number().max(999999).allow(null).allow(''),
        description: Joi.string().allow(null).allow(''),
        from: Joi.string().allow(null).allow(''),
        to: Joi.string().allow(null).allow(''),
        subject: Joi.string().allow(null).allow(''),
        text: Joi.string().allow(null).allow(''),
        html: Joi.string().allow(null).allow(''),
        isSended: Joi.boolean().allow(null).allow(''),
        isImediate: Joi.boolean().allow(null).allow(''),
        notificationTypeId: Joi.number().max(999999).allow(null).allow(''),
        notificationType: Joi.string().allow(null).allow('')
    })).allow(null);

}
