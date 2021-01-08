import * as Hapi from "@hapi/hapi";
import * as path from "path";
import {IServerSettings} from "../../../setting";
import {Sequelize} from "sequelize";
import {NotificationData} from "../data/notification.data";
import {GenericController, IGenericController} from "../../../common/controller/generic.controller";
import {Notification} from "../model/notification.model";

export class NotificationController extends GenericController<Notification> implements INotificationController {
    private static notificationController: NotificationController = null;
    notificationData: NotificationData;
    private appDir: string = path.dirname(require.main.filename);

    private constructor(protected server: Hapi.server, protected  configs: IServerSettings, protected database: Sequelize) {
        super(server, configs, database, NotificationData.getInstance(server, configs, database));
        this.notificationData = NotificationData.getInstance(server, configs, database);
    }

    public static getInstance(server: Hapi.server, configs: IServerSettings, database: Sequelize) {
        if ( this.notificationController == null ) {
            this.notificationController = new NotificationController(server, configs, database);
        }
        return this.notificationController;
    }


    public async findById(id: string) {
        return await this.notificationData.findById(id, ['id', 'description', 'from', 'to', 'subject', 'text', 'html', 'isSended', 'isImediate', 'scheduler', 'notificationType']);
    }

    public async list() {
        return await this.notificationData.list(['id', 'description', 'from', 'to', 'subject', 'text', 'html', 'isSended', 'isImediate', 'scheduler', 'notificationType']);
    }

    public async createNotificationByForgotPassword(email: string, token: string) {
        let notification: Notification = new Notification();
        notification.id                 = null;
        notification.from               = 'no-reply@medcode.com.br';
        notification.to                 = email;
        notification.subject            = 'Recuperação de Senha';
        notification.text               = `http://127.0.0.1:3000/security/rewrite?token=${token}`;
        notification.html               = `http://127.0.0.1:3000/security/rewrite?token=${token}`;
        notification.isSended           = false;
        notification.isImediate         = true;
        notification.notificationType   = Notification.EMAIL;
        return await this.notificationData.create(JSON.parse(JSON.stringify(notification)));
    }

    public async createNotificationByNewPassword(email: string, password: string) {
        let notification: Notification = new Notification();
        notification.id                 = null;
        notification.from               = 'no-reply@medcode.com.br';
        notification.to                 = email;
        notification.subject            = 'Senha de Acesso';
        notification.text               = `Senha: ${password}`;
        notification.html               = `Senha: ${password}`;
        notification.isSended           = false;
        notification.isImediate         = true;
        notification.notificationType   = Notification.EMAIL;
        return await this.notificationData.create(JSON.parse(JSON.stringify(notification)));
    }
}

export interface INotificationController extends IGenericController<Notification> {
    createNotificationByForgotPassword(email: string, token: string);
    createNotificationByNewPassword(email: string, password: string);
}
