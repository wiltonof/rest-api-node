/**
 * Created by wilton on 18/03/2019.
 */
// @ts-ignore
import {BelongsToMany, Column, Table} from "sequelize-typescript";
import {RolePermission} from "./role-permission.model";
import {Role} from "./role.model";
import {AbstractModel, IAbstractModel} from '../../../common/model/abstract.model';


@Table({tableName:'permissions', modelName: 'Permission'})
export class Permission extends AbstractModel<Permission> {

    @Column
    name: string;

    @Column
    description: string;

    @BelongsToMany(() => Role, () => RolePermission)
    roles: Role[];

}
