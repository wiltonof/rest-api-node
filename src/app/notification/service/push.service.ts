import * as Hapi from "@hapi/hapi";
import * as path from "path";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {INotificationService} from "./notification.service";
import {Notification} from "../model/notification.model";
import {NotificationData} from "../data/notification.data";


export class PushService  implements INotificationService {
    private appDir: string = path.dirname(require.main.filename);
    private notificationData: NotificationData;
    constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        this.notificationData = NotificationData.getInstance(server, configs, database);
    }

    public async send(notification: Notification) {
        return await this.notificationData.findById(notification.id);
    }

}
