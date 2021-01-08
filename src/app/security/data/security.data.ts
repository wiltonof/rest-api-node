import * as Hapi from "@hapi/hapi";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {Credential} from "../model/credential.model";
import {Role} from "../model/role.model";
import {Permission} from "../model/permission.model";
import {GenericData, IGenericData} from "../../../common/data/generic.data";

export class SecurityData extends GenericData<Credential> implements ISecurityData {
    private static securityData: SecurityData = null;
    private constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        super(server, configs, database, 'Setting');
    }

    public static getInstance(server: Hapi.server, configs: IServerSettings, database: Sequelize) {
        if (this.securityData == null) {
            this.securityData = new SecurityData(server, configs, database);
        }
        return this.securityData;
    }

    public async forgot(email: string) {
    }

    public async login(username: string) {
        let credential: Credential = await Credential.findOne(
            {
                attributes: ['id', 'username', 'password'],
                include:[
                    {
                        attributes: ['name', 'description'],
                        model: Role,
                        as: 'roles',
                        through: {
                            attributes: []
                        },
                        include:[
                            {
                                attributes: ['name', 'description'],
                                model: Permission,
                                as: 'permissions',
                                through: {
                                    attributes: []
                                }
                            }
                        ]
                    }
                ],
                where: {username: username}
            });
        return credential;
    }

    public async rewrite(password: string, rewritePassword: string) {
    }
}

export interface ISecurityData extends IGenericData {
    login(username: string, password: string);
    forgot(email: string);
    rewrite(password: string, rewritePassword: string);
}
