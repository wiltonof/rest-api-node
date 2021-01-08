/**
 * Created by wilton on 18/03/2019.
 */
import * as Hapi from '@hapi/hapi';
import { IServerSettings } from "../../../setting/index";
import { SecurityFacade } from "../facade/security.facade";
import { Sequelize } from "sequelize";
import {SecurityValidator} from "../validator/security.validator";
import {SecurityController} from "../controller/security.controller";



export default function (server: Hapi.server, settings: IServerSettings, sequelize: Sequelize) {

    const facade = new SecurityFacade(settings, sequelize,  SecurityController.getInstance(server, settings, sequelize));
    server.bind(facade);

    server.route({
        method: 'POST',
        path: '/securities/token',
        config: {
            auth: false,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'BadRequest'
                        }
                    }
                }
            },
            response: {
                schema: SecurityValidator.responseLoginUserModel
            },
            description: 'Gerar token de autenticação',
            notes: 'Serviço para gerar token de autenticação',
            tags: ['api'], // ADD THIS TAG
            validate: {
                payload: SecurityValidator.loginUserModel
            },
            handler: facade.login
        }
    });

    server.route({
        method: 'POST',
        path: '/securities/forgot',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['FORGOT_PASSWORD']
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
                schema: SecurityValidator.responsePostPutAndDelete
            },
            description: 'Solicitar recuperação de senha',
            notes: 'Serviço para solicitar recuperação de senha',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: SecurityValidator.jwtValidator,
                payload: SecurityValidator.emailOnly
            },
            handler: facade.forgot
        }
    });

    server.route({
        method: 'POST',
        path: '/securities/rewrite',
        config: {
            auth: 'jwt',
            plugins: {
                'hapiAuthorization': {
                    roles: ['REWRITE_PASSWORD']
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
                schema: SecurityValidator.responsePostPutAndDelete
            },
            description: 'Efetiver modificação de senha',
            notes: 'Serviço para efetivar modificação de senha',
            tags: ['api'], // ADD THIS TAG
            validate: {
                headers: SecurityValidator.jwtValidator,
                payload: SecurityValidator.rewrite
            },
            handler: facade.rewrite
        }
    });

}
