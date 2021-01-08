import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Credential} from "./credential.model";
import {Role} from "./role.model";
import {UUID} from "sequelize";

@Table({tableName:'credential_role', modelName: 'CredentialRole'})
export class CredentialRole extends Model<CredentialRole> {

    @ForeignKey(() => Credential)
    @Column({field:'credential_id', type: UUID})
    credentialId: string;

    @ForeignKey(() => Role)
    @Column({field:'role_id', type: UUID})
    roleId: string;
}
