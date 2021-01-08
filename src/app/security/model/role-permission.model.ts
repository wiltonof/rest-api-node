/**
 * Created by wilton on 18/03/2019.
 */
import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Permission} from "./permission.model";
import {Role} from "./role.model";
import {UUID} from "sequelize";



@Table({tableName:'role_permission', modelName: 'RolePermission', paranoid: false})
export class RolePermission extends Model<RolePermission> {

    @ForeignKey(() => Role)
    @Column({field:'role_id', type: UUID})
    roleId: string;

    @ForeignKey(() => Permission)
    @Column({field:'permission_id', type: UUID})
    permissionId: string;
}
