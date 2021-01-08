/**
 *  * Created by Wilton O. Ferreira on 14/05/2020
 */

import * as Hapi from '@hapi/hapi';
import {Sequelize, UniqueConstraintError} from "sequelize";
import {AbstractModel} from "../model/abstract.model";
import {IServerSettings} from "../../setting";
import {CreateError} from "../error/create.error";
import {DeleteError} from "../error/delete.error";
import {UpdateError} from "../error/update.error";
import {FindError} from "../error/find.error";
import {ListError} from "../error/list.error";
import {CreateUniqueConstraintError} from "../error/create-unique-constraint.error";


export abstract class GenericData<T extends AbstractModel<T>> implements IGenericData {

    constructor(
        protected server: Hapi.server,
        protected  configs: IServerSettings,
        protected database: Sequelize,
        protected entity: string
    ) { }

    public async create<T>(obj: any) {
        try {
            return await this.database.models[this.entity].create(JSON.parse(JSON.stringify(obj)));
        } catch (e) {
            console.log(e);
            if (e  instanceof UniqueConstraintError || e.name === 'SequelizeUniqueConstraintError') {
                this.server.log(['error'], {error: `[${this.entity}]:create:UniqueConstraintError:: ${e.toString()}`});
                throw new CreateUniqueConstraintError('UniqueConstraintError');
            } else {
                this.server.log(['error'], {error: `[${this.entity}]:create:CreateError:: ${e.toString()}`});
                throw new CreateError('CreateError');
            }
        }
    }

    public async delete(id: string, physic: boolean = false) {
        try {
            return await this.database.models[this.entity].destroy({where:{ id: id}});
        } catch (e) {
            this.server.log(['error'], {error: `[${this.entity}]:create:DeleteError:: ${e.toString()}`});
            throw new DeleteError(e);
        }
    }

    public async update(obj: any, id: string) {
        try {
            return await this.database.models[this.entity].update(JSON.parse(JSON.stringify(obj)), {where:{ id: id}});
        } catch (e) {
            this.server.log(['error'], {error: `[${this.entity}]:create:UpdateError:: ${e.toString()}`});
            throw new UpdateError(e);
        }
    }

    public async findById(id: string, attributes: string[] = null) {
        try {
            if (attributes != null) {
                return await this.database.models[this.entity].findOne({attributes: attributes, where:{ id: id}, order: [['id', 'asc']]});
            } else {
                return await this.database.models[this.entity].findOne({where:{ id: id}, order: [['id', 'asc']]});
            }
        } catch (e) {
            this.server.log(['error'], {error: `[${this.entity}]:create:FindError:: ${e.toString()}`});
            throw new FindError(e);
        }
    }

    public async list(attributes: string[] = null, offset: number = null, limit: number = null) {
        let params = {
            attributes: attributes,
            limit: limit || 10,
            offset: offset || 0
        };

        try {
            if (attributes != null && attributes.length > 0) {
                return await this.database.models[this.entity].findAll({
                    attributes: params.attributes,
                    order: [
                        ['createAt', 'DESC']
                    ],
                    offset: params.offset,
                    limit: params.limit
                });
            } else {
                return await this.database.models[this.entity].findAll(
                    {
                        order: [
                            ['createAt', 'DESC']
                        ],
                        offset: params.offset,
                        limit: params.limit
                    }
                );
            }
        } catch (e) {
            this.server.log(['error'], {error: `[${this.entity}]:create:ListError:: ${e.toString()}`});
            throw new ListError(e);
        }
    }

}

export interface IGenericData {
    list(attributes: string[], offset: number, limit: number);
    findById(id: string, attributes: string[]);
    create(obj: any);
    update(obj: any, id: string);
    delete(id: string, physic: boolean);
}
