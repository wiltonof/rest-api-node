/**
 *  * Created by Wilton O. Ferreira on 14/05/2020
 */


import {Column, CreatedAt, DataType, DeletedAt, Model, UpdatedAt} from "sequelize-typescript";


export class AbstractModel<T> extends Model<T> {

    @Column({field:'id', type: DataType.UUID, primaryKey:true, defaultValue: DataType.UUIDV4})
    id: string;

    @CreatedAt
    @Column({field: 'created_at'})
    createAt: Date;

    @UpdatedAt
    @Column({field: 'updated_at'})
    updatedAt: Date;

    @DeletedAt
    @Column({field: 'delete_at'})
    deletedAt: Date;
}

export interface IAbstractModel {
    id: string;
    createAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
