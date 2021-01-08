/**
 * Created by wilton on 18/03/2019.
 */
// @ts-ignore
import {BelongsToMany, Column, Table} from "sequelize-typescript";
import {Permission} from "./permission.model";
import {RolePermission} from "./role-permission.model";
import {AbstractModel, IAbstractModel} from '../../../common/model/abstract.model';


@Table({tableName:'roles', modelName:'Role'})
export class Role extends AbstractModel<Role> {

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    description: string;

    @Column
    abbreviation:string;

    @BelongsToMany(() => Permission, () => RolePermission)
    permissions: Permission[];

}
