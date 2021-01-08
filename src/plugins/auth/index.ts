/**
 * Created by wilton on 18/02/2020.
 */

import * as Hapi from "@hapi/hapi";
import * as Autorization from 'hapi-authorization';
import { IDatabaseSetting } from "../../setting/index";
import {IServerSettings} from "../../setting";
import {Credential, ICredential} from "../../app/security/model/credential.model";
import {SecurityController} from "../../app/security/controller/security.controller";
import {Sequelize} from "sequelize";
import {SecurityData} from "../../app/security/data/security.data";

export class Security {
    private securityData: SecurityData;

    constructor(protected server: Hapi.server, protected settings: IServerSettings, database: Sequelize) {
        this.securityData = SecurityData.getInstance(server, this.settings, database);
    }

    async register(server: Hapi.Server, database: IDatabaseSetting) {
        const validate = async (decoded, request) => {
            let credential: Credential = await this.securityData.login(decoded.credential);
            if (credential != null && credential.roles != null) {
                var roles = [];
                for (let role of credential.roles) {
                    role.permissions.forEach((permission) => {
                        roles.push(permission.name);
                    });
                }
                return {isValid: true, credentials: {account:credential , role: roles}};
            } else {
                return { isValid: false };
            }
        };

        let plugins = [
            {
                plugin: require('hapi-auth-jwt2')
            },
            {
                plugin: Autorization,
                options: {
                    roles: ['LOGIN_SYS']	// Can also reference a function which returns an array of roles
                }
            }
        ];

        await server.register(plugins);

        await server.auth.strategy('jwt', 'jwt',
            { key: this.settings.jwtSecret,          // Never Share your secret key
                validate: validate,            // validate function defined above
                verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
            });

        await server.auth.default('jwt');

    }
}
