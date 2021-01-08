
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {INotificationController} from "../controller/notification.controller";
import {Notification} from "../model/notification.model";
import {GenericFacade} from "../../../common/facade/generic.facade";

export class NotificationFacade extends GenericFacade<Notification> {

    constructor(protected configs: IServerSettings, protected database: Sequelize, protected controller: INotificationController) {
        super(configs, database, controller);
    }
}
