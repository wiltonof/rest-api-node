import * as Hapi from "@hapi/hapi";
import NotificationRoutes from "./routes/notification.routes";
import {IServerSettings} from "../../setting/index";
import {Sequelize} from "sequelize";
import {NotificationService} from "./service/notification.service";

export function init(server: Hapi.Server, settings: IServerSettings, database: Sequelize) {
    NotificationRoutes(server, settings, database);
    new NotificationService(server, settings, database);
}
