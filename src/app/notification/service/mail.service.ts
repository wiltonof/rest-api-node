"use strict";
import * as Hapi from "@hapi/hapi";
import * as path from "path";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import * as nodemailer from "nodemailer";
import {NotificationData} from "../data/notification.data";
import {Notification} from "../model/notification.model";
import {INotificationService} from "./notification.service";

const account = {
    user: "devtracktester@gmail.com",
    pass: "!Q@W#E$R5t"
};

// create reusable transporter object using the default SMTP transport
let createTransporter = async (account) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL,
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });
    return transporter;
};

export class MailService implements INotificationService {
    private appDir: string = path.dirname(require.main.filename);
    private notificationData: NotificationData;

    constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        this.notificationData = NotificationData.getInstance(server, configs, database);
    }

    public async send(notification: Notification) {
        try {
            let transporter = await createTransporter(account);
            // send mail with defined transport object
            let mail = {
                from: notification.from,
                to: notification.to,
                subject: notification.subject,
                text: notification.text,
                html: notification.html,
            };
            let info = await transporter.sendMail(mail);
            notification.isSended = true;
            notification.sendedCode = info.messageId;
            return  notification;
        } catch (err) {
            console.log(err);
        }
    }

}
