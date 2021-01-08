import {Column, DataType, Table} from "sequelize-typescript";
import {AbstractModel, IAbstractModel} from "../../../common/model/abstract.model";


@Table({tableName:'notifications', modelName: 'Notification'})
export class Notification extends AbstractModel<Notification> implements INotification {
    static SECURITY_VALIDATION_TWO_FACTOR: string = 'SECURITY_VALIDATION_TWO_FACTOR';
    static SMS: string = 'SMS';
    static EMAIL: string = 'EMAIL';
    static PUSH: string = 'PUSH';

    @Column({allowNull: true})
    description: string;

    @Column({allowNull: true})
    from: string;

    @Column({allowNull: true})
    to: string;

    @Column({allowNull: true})
    subject: string;

    @Column({allowNull: true, type: DataType.TEXT})
    text: string;

    @Column({allowNull: true, type: DataType.TEXT})
    html: string;

    @Column({allowNull: true, field: 'is_sended', type: DataType.BOOLEAN})
    isSended: boolean;

    @Column({allowNull: true, field: 'is_imediate', type: DataType.BOOLEAN})
    isImediate: boolean;

    @Column(DataType.ENUM('EMAIL', 'SMS', 'PUSH'))
    notificationType: string;

    @Column({allowNull: true, field: 'sended_code'})
    sendedCode: string;

}

export interface INotification extends IAbstractModel {
    description: string;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    isSended: boolean;
    isImediate: boolean;
    notificationType: string;
}
