/**
 *  * Created by Wilton O. Ferreira on 14/05/2020
 */

import * as Hapi from "@hapi/hapi";
import {Sequelize} from "sequelize";
import {IGenericController} from "../controller/generic.controller";
import {InternalError} from "../error/internal.error";
import {ListError} from "../error/list.error";
import {FindError} from "../error/find.error";
import {UpdateError} from "../error/update.error";
import {DeleteError} from "../error/delete.error";
import {CreateError} from "../error/create.error";
import {AbstractModel} from "../model/abstract.model";
import {IServerSettings} from "../../setting";
import {CreateUniqueConstraintError} from "../error/create-unique-constraint.error";
import {ValidateFileTypePngError} from "../error/validate-file-type-png.error";
import {ValidateFileTypePDFError} from "../error/validate-file-type-pdf.error";
import {NotFoundError} from "../error/not-found.error";


export abstract class GenericFacade<T extends AbstractModel<T>> {

    constructor(protected configs: IServerSettings, protected database: Sequelize, protected controller: IGenericController<T>) {}

    public async list(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let list: T[] = await this.controller.list([], request.query.offset, request.query.limit);
            return reply.response(JSON.parse(JSON.stringify(list))).code(200);
        } catch (e) {
            if (e instanceof ListError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(e);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }

    public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let obj: T = await this.controller.findById(request.params.id, []);
            if (obj !== null) {
                return reply.response(JSON.parse(JSON.stringify(obj))).code(200);
            } else {
                throw new NotFoundError("NotFoundError");
            }

        } catch (e) {
            if (e instanceof FindError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else if (e instanceof NotFoundError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(e);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }

    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let obj: T = await this.controller.create(request.payload);
            let msg = {
                message: 'create',
                description: 'Registro criado com sucesso!',
                code: 201
            };
         //   console.log(msg);
            return reply.response(JSON.parse(JSON.stringify(obj))).code(201);
          //  return reply.response(JSON.parse(JSON.stringify(msg))).code(201);
        } catch (e) {
            if (e instanceof CreateError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else if (e instanceof CreateUniqueConstraintError) {
                return  reply.response(e.getError()).code(e.getError().code);
            } else if (e instanceof ValidateFileTypePngError) {
                return  reply.response(e.getError()).code(e.getError().code);
            } else if (e instanceof ValidateFileTypePDFError) {
                return  reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(e);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }

    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            await this.controller.update(request.payload, request.params.id);
            let msg = {
                message: 'update',
                description: 'Registro atualizado com sucesso!',
                code: 201
            };
            return reply.response(JSON.parse(JSON.stringify(msg))).code(201);
        } catch (e) {
            if (e instanceof UpdateError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(e);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }

    public async delete(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            await this.controller.delete(request.params.id, false);
            let msg = {
                message: '',
                description: 'Registro apagado com sucesso!',
                code: 201
            };
            return reply.response(JSON.parse(JSON.stringify(msg))).code(201);
        } catch (e) {
            if (e instanceof DeleteError) {
                return reply.response(e.getError()).code(e.getError().code);
            } else {
                let error = new InternalError(e);
                return reply.response(error.getError()).code(error.getError().code);
            }
        }
    }
}
