/**
 *  * Created by Wilton O. Ferreira on 14/05/2020
 */

import * as Hapi from '@hapi/hapi';
import {Sequelize} from "sequelize";
import {IGenericData} from "../data/generic.data";
import {AbstractModel} from "../model/abstract.model";
import {IServerSettings} from "../../setting";

export abstract class GenericController<T extends AbstractModel<T>> implements IGenericController<T> {

    constructor(
        protected server: Hapi.server,
        protected configs: IServerSettings,
        protected database: Sequelize,
        protected data: IGenericData
    ) {

    }

    public async list(attributes: string[] = null, limit: number = null, offset: number = null) {
        return this.data.list(attributes, limit, offset);
    }

    public async findById(id: string, attributes: string[] = null) {
        return this.data.findById(id, attributes);
    }
    public async create(obj: T) {
        return this.data.create(obj);
    }
    public async update(obj: T, id: string) {
        return this.data.update(obj, id);
    }
    public async delete(id: string, physic: boolean) {
        return this.data.delete(id, physic);
    }
}

export interface IGenericController<T extends AbstractModel<T>> {
    list(attributes: string[], limit: number, offset: number );
    findById(id: string, attributes: string[]);
    create(ojb: T);
    update(ojb: T, id: string);
    delete(id: string, physic: boolean);
}
