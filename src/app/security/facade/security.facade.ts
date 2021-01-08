/**
 * Created by wilton on 18/03/2019.
*/
// @ts-ignore
import * as Hapi from "@hapi/hapi";
import {IServerSettings} from "../../../setting/index";
import {ISecurityController} from "../controller/security.controller";
import {Op, Sequelize} from "sequelize";
import {GenericFacade} from "../../../common/facade/generic.facade";
import {UnauthorizedError} from "../../../common/error/unauthorized.error";
import {InternalError} from "../../../common/error/internal.error";
import {MessageUtil} from "../../../common/util/message.util";
import {FindError} from "../../../common/error/find.error";
import {Credential} from "../model/credential.model";


export class SecurityFacade extends GenericFacade<Credential> {
    constructor(protected configs: IServerSettings, protected database: Sequelize, protected controller: ISecurityController) {
        super(configs, database, controller);
    }

    public async login(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
       try {
           let login = await this.controller.login(request.payload.email, request.payload.password);
           return reply.response(login);
       } catch (e) {
           if (e instanceof UnauthorizedError) {
               return reply.response(e.getError()).code(e.getError().code);
           } else {
               let error = new InternalError(MessageUtil.INTERNAL_SERVER_ERROR);
               return reply.response(error.getError()).code(error.getError().code);
           }
       }
    }

    public async forgot(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            await this.controller.forgot(request.email);
            let msg = {
                message: MessageUtil.REGISTRY_SUCCESS_CREATED,
                description: 'Registro criado com sucesso!',
                code: 201
            };
            return reply.response(JSON.parse(JSON.stringify(msg))).code(201);
        } catch (e) {
            if (e instanceof FindError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(MessageUtil.INTERNAL_SERVER_ERROR);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }

    public async rewrite(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            await this.controller.rewrite(request.email, request.password, request.rewritePassword);
            let msg = {
                message: MessageUtil.REGISTRY_SUCCESS_CREATED,
                description: 'Registro criado com sucesso!',
                code: 201
            };
            return reply.response(JSON.parse(JSON.stringify(msg))).code(201);
        } catch (e) {
            if (e instanceof FindError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(MessageUtil.INTERNAL_SERVER_ERROR);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }
}
