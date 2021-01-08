/**
 * Created by Wilto Oliveira Ferreira on 01/09/2019.
*/
import * as Hapi from "@hapi/hapi";
import {IServerSettings} from "../../setting/index";
import {Sequelize} from "sequelize";
import SecurityRoutes from "./routes/security.routes";

export function init(server: Hapi.Server, settings: IServerSettings, database: Sequelize) {
    SecurityRoutes(server, settings, database);
}
