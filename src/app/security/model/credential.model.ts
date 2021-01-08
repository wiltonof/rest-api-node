/**
 * Created by Wilton O. Ferreira on 15/08/2019.
 */
import { Table, Column, BelongsToMany} from 'sequelize-typescript';
import {AbstractModel, IAbstractModel} from '../../../common/model/abstract.model';
import {Role} from "./role.model";
import {CredentialRole} from "./credential-role.model";

@Table({tableName:'credentials', modelName: 'Credential'})
export class Credential extends AbstractModel<Credential> {

    @Column({allowNull: false})
    username: string;

    @Column({allowNull: false})
    password: string;

    @Column({allowNull: true, field: 'forgot_password_code'})
    forgotPasswordCode: string;

    @BelongsToMany(() => Role, () => CredentialRole)
    roles: Role[];

}

export interface ICredential extends  IAbstractModel {
    email: string;
    password: string;
    forgotPasswordCode: string;
    roles: Role[];
}
