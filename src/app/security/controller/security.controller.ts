/**
 * Created by wilton on 18/03/2019.
*/
import * as Hapi from "@hapi/hapi";
import * as Bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {IServerSettings} from "../../../setting/index";
import {Sequelize} from "sequelize";
import {Credential, ICredential} from "../model/credential.model";
import {Role} from "../model/role.model";
import {GenericController, IGenericController} from "../../../common/controller/generic.controller";
import {SecurityData} from "../data/security.data";
import {NotificationController} from "../../notification/controller/notification.controller";
import {UnauthorizedError} from "../../../common/error/unauthorized.error";
import * as path from "path";
import {FindError} from "../../../common/error/find.error";
import {InternalError} from "../../../common/error/internal.error";
import {PasswordNotMatchError} from "../../../common/error/password-not-match.error";
import {MessageUtil} from "../../../common/util/message.util";
import * as generator from 'generate-password';

export class SecurityController extends GenericController<Credential> implements ISecurityController {
    private static securityController: SecurityController = null;
    private securityData: SecurityData;
    private notificationController: NotificationController;

    private appDir: string = path.dirname(require.main.filename);

    private constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        super(server, configs, database, SecurityData.getInstance(server, configs, database));
        this.securityData = SecurityData.getInstance(server, configs, database);
        this.notificationController = NotificationController.getInstance(server, configs, database);
    }

    public static getInstance(server: Hapi.Server, configs: IServerSettings, database: Sequelize) {
        if ( this.securityController == null ) {
            this.securityController = new SecurityController(server, configs, database);
        }
        return this.securityController;
    }
    private async hashPassword (password: string) {

        const saltRounds = 10;

        const hashedPassword = await new Promise((resolve, reject) => {
            Bcrypt.hash(password, saltRounds, function(err, hash) {
                resolve(hash);
            });
        }).then(e => {
            return e;
        });

        return hashedPassword;
    }

    private async getPermissions(roles: Role[]) {
        let permissions = [];
        for (let role of roles) {
            for (let permission of role.permissions) {
                permissions.push(permission);
            }
        }
        return permissions;
    }

    private async getRoles(roles: Role[]) {
        let rolesValue = [];
        for (let role of roles) {
            rolesValue.push({name: role.name, description: role.description});
        }
        return rolesValue;
    }

    private async getGeneratedToken(token: any) {
        return new Promise((resolve, reject) => {
            return jwt.sign(JSON.stringify(token), this.configs.jwtSecret, (err, result) => {
                resolve(result);
            });
        });
    }

    public async login(email: string, password: string) {
        let message = '';

        if (!email || !password) {
            throw new UnauthorizedError(MessageUtil.INVALID_LOGIN_OR_PASSWORD);
        } else {
            let credential: Credential = await this.securityData.login(email);
            if (credential != null) {
                let passwordValid = await  Bcrypt.compareSync(password, credential.password);
                let token = {credential:credential.username};
                if (passwordValid) {
                    let responseValue = {
                        'token': await this.getGeneratedToken(token),
                        'username': credential.username,
                        'roles': await this.getRoles(credential.roles),
                        'permissions': await this.getPermissions(credential.roles)
                    };
                    console.log(JSON.parse(JSON.stringify(responseValue)));
                    return JSON.parse(JSON.stringify(responseValue));
                } else {
                    throw new UnauthorizedError(MessageUtil.INVALID_LOGIN_OR_PASSWORD);
                }
            } else {
                throw new UnauthorizedError(MessageUtil.INVALID_LOGIN_OR_PASSWORD);
            }
        }
    }

    public async create(credential: Credential) {
        let passwordCode = await generator.generate({length: 8, numbers: true, uppercase: true, excludeSimilarCharacters: true}).toUpperCase();
        credential.password = <string>await this.hashPassword(passwordCode);
        await this.notificationController.createNotificationByNewPassword(credential.username, passwordCode.toString());
        return await this.securityData.create(credential);
    }

    public async update(credential: Credential, id: string) {
        return await this.securityData.update(credential, id);
    }


    public async forgot(email: string) {
        try {
            let credential: Credential =  await this.securityData.login(email);
            if (!credential) {
                throw new FindError(MessageUtil.FIND_ERROR_DATA);
            }
            let forgotPasswordCode = await generator.generate({length: 25, numbers: true, uppercase: true, excludeSimilarCharacters: true}).toUpperCase();
            credential.forgotPasswordCode = forgotPasswordCode;
            await this.securityData.update(credential, credential.id);
            let createdAt = new Date();
            let token = await this.getGeneratedToken({credential: credential.username, type: 'REWRITE_PASSWORD', createdAt: createdAt, forgotPasswordCode: forgotPasswordCode});
            return await this.notificationController.createNotificationByForgotPassword(email, token.toString());
        } catch (e) {
            throw new InternalError(MessageUtil.INTERNAL_SERVER_ERROR);
        }
    }

    public async rewrite(email: string, password: string, rewritePassword: string) {
        if (password === rewritePassword) {
            let credential: Credential =  await this.securityData.login(email);
            credential.password = <string>await this.hashPassword(password);
            credential.forgotPasswordCode = null;
            await this.securityData.update(credential, credential.id);
            return;
        } else {
            throw  new PasswordNotMatchError(MessageUtil.PASSWORD_NOT_MATCH_ERROR);
        }
    }

    public async findByEmail(email: string) {
        return this.securityData.login(email);
    }
}

export interface ISecurityController extends IGenericController<Credential> {
    login(email: string, password: string);
    forgot(email: string);
    rewrite(email: string, password: string, rewritePassword: string);
    findByEmail(email: string);
}
