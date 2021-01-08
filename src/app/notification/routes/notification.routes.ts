/**
 * Created by Wilto Oliveira Ferreira on 01/09/2019.
 */
import * as Hapi from "@hapi/hapi";
import { IServerSettings } from "../../../setting/index";
import { Sequelize } from "sequelize";
import {NotificationFacade} from "../facade/notification.facade";
import {NotificationValidator} from "../validator/notification.validator";
import {NotificationController} from "../controller/notification.controller";


export default function (server: Hapi.server, settings: IServerSettings, sequelize: Sequelize) {

    const notificationFacade = new NotificationFacade(settings, sequelize, NotificationController.getInstance(server, settings, sequelize));
    server.bind(notificationFacade);

    server.route({
        method: 'POST',
        path: '/notification/create',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['CREATE_NOTIFICATION']
                },
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            response: {
                schema: NotificationValidator.responsePostPutAndDelete
            },
            description: 'Criar notificação',
            notes: 'Serviço para criar notificação',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: NotificationValidator.jwtValidator,
                payload: NotificationValidator.postNotificationPayload
            },
            handler: notificationFacade.create
        }
    });

    server.route({
        method: 'PUT',
        path: '/notification/update/{id}',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['UPDATE_NOTIFICATION']
                },
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            description: 'Atualizar notifiação',
            notes: 'Serviço para atualizar notificação',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: NotificationValidator.jwtValidator,
                params:  NotificationValidator.byId,
                payload: NotificationValidator.putNotificationPayload
            },
            handler: notificationFacade.update
        }
    });

    server.route({
        method: 'GET',
        path: '/notification/find/{id}',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['VIEW_NOTIFICATION']
                },
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            response: {
                schema: NotificationValidator.getNotificationById
            },
            description: 'Localizar operador por id',
            notes: 'Serviço para localizar um operador por id',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: NotificationValidator.jwtValidator,
                params: NotificationValidator.byId
            },
            handler: notificationFacade.findById
        }
    });

    server.route({
        method: 'GET',
        path: '/notification/list',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['VIEW_NOTIFICATION']
                },
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            response: {
                schema: NotificationValidator.getNotificationList
            },
            description: 'Listar todas as notificações',
            notes: 'Serviço para listar todas as notificações',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: NotificationValidator.jwtValidator
            },
            handler: notificationFacade.list
        }
    });

    server.route({
        method: 'DELETE',
        path: '/notification/delete/{id}',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['DELETE_NOTIFICATION']
                },
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            description: 'Apagar notificação por id',
            notes: 'Serviço para apagar uma notificação por id',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: NotificationValidator.jwtValidator,
                params: NotificationValidator.byId
            },
            handler: notificationFacade.delete
        }
    });

}
