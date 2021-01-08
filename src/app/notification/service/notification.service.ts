import * as Hapi from "@hapi/hapi";
import * as path from "path";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {MailService} from "./mail.service";
import {NotificationData} from "../data/notification.data";
import {SmsService} from "./sms.service";
import {PushService} from "./push.service";
import {Notification} from "../model/notification.model";
const timer = require('cron');
const CronJob = timer.CronJob;


export class NotificationService {
    private appDir: string = path.dirname(require.main.filename);
    mailService: MailService;
    smsService: SmsService;
    pushService: PushService;
    notificationData: NotificationData;
    private readonly cron: string;
    private sync: boolean;
    private hierarchy: any;
    private job: any;
    private translatedAttributes: any[];

    constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        this.mailService = new MailService(server, configs, database);
        this.smsService = new SmsService(server, configs, database);
        this.pushService = new PushService(server, configs, database);
        this.notificationData = NotificationData.getInstance(server, configs, database);
        this.sync = false;
        this.hierarchy = null;
        this.cron = '1 * * * * *';
        this.job = new CronJob(this.cron, () => {
            this.processJob();
        });
        this.job.start();
        this.translatedAttributes = [];
    }


    private async processNotification(notification: Notification) {
        let notificationResult: any = null;
        switch (notification.notificationType) {
            case 'EMAIL' :
                notificationResult = await this.mailService.send(notification);
                break;
            case 'SMS' :
                notificationResult = await this.smsService.send(notification);
                break;
            case 'PUSH' :
                notificationResult = await this.pushService.send(notification);
                break;
            default:
                return;
        }
        await this.notificationData.update(notificationResult, notificationResult.id);
        return notificationResult;
    }

    private async processJob() {
        console.log('processJOB Started!');
        let notifications = await this.notificationData.findAllNotSended();
        if (notifications.length <= 0) {
            console.log("Não existem notificações para envio");
        }
        for (const notification of notifications) {
            this.processNotification(notification);
        }
    }

    public async imediateExecult(notification: Notification) {
        let notificationCreated = await this.notificationData.create(notification);
        await this.mailService.send(notificationCreated as Notification);
        await this.processNotification(notification);
        return notificationCreated;
    }


    public async lazyExeclut(notification: Notification) {
        let notificationCreated = await this.notificationData.create(notification);
        return notificationCreated;
    }

}

export interface INotificationService {
    send(notification: Notification);
}
