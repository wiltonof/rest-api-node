"use strict";
import * as Hapi from "@hapi/hapi";
import * as path from "path";
import * as AWS from "aws-sdk";
import {NotificationData} from "../data/notification.data";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {INotificationService} from "./notification.service";
import {Notification} from "../model/notification.model";

export class SmsService  implements INotificationService {
    private appDir: string = path.dirname(require.main.filename);
    publishText = new AWS.SNS({ apiVersion: '2010-03-31' });
    private notificationData: NotificationData;

    constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        this.notificationData = NotificationData.getInstance(server, configs, database);
    }

    private async mountMessage(notification: Notification) {
        let params = {
            Message: notification.text,
            PhoneNumber: '+' + notification.to
        };
        return params;
    }

    public async send(notification: Notification) {
        let message = await this.mountMessage(notification);
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(message).promise();
        return new Promise((resolve, reject) => {
            resolve(publishTextPromise);
        }).then(data => {
            if (data != null) {
                // @ts-ignore
                notification.sendedCode = String(data.MessageId);
                notification.isSended = true;
            }
            return notification;
        });
    }
}
