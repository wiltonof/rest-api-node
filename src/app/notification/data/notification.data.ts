
import * as Hapi from '@hapi/hapi';
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {Notification} from "../model/notification.model";
import {GenericData, IGenericData} from "../../../common/data/generic.data";


export class NotificationData extends GenericData<Notification> implements INotificationData {
    private static notificationData: NotificationData = null;
    private constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        super(server, configs, database, 'Notification');
    }

    public static getInstance(server: Hapi.server, configs: IServerSettings, database: Sequelize) {
        if (this.notificationData == null) {
            this.notificationData = new NotificationData(server, configs, database);
        }
        return this.notificationData;
    }

    public async findAllNotSended() {
        return await Notification.findAll({
            attributes: ['id', 'description', 'from', 'to', 'subject', 'text', 'html', 'isSended', 'isImediate', 'notificationType'],
            limit: 5,
            where: { isSended: false }
        });
    }
}

export interface INotificationData extends IGenericData {
}
