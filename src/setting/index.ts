/**
 * Created by wilton on 21/02/2020.
 */
import * as nconf from 'nconf';
import * as path from 'path';

const settings = nconf.file(path.join(__dirname, './settings.json'));

export interface IEnvironment {
    projectName: string;
    version: string;
    database: IDatabaseSetting;
    server: IServerSettings;
}

export interface IServerSettings {
    port: number;
    plugins: Array<string>;
    jwtSecret: string;
    jwtExpiration: string;
    host: string;
    routePrefix: string;
    uploadPath: string;
    hostSwagger: string;
    scheme: string;
}

export interface IDatabaseSetting {
    database: string;
    dialect: string;
    username: string;
    password: string;
    host: string;
    forceSync: boolean;
}

export function getSettings(env?: string): IEnvironment {
    return settings.get(env || 'dev');
}

export function getProjectName(): string {
    return settings.get('projectName');
}

export function getVersion(): string {
    return settings.get('version');
}

export function getDatabase(env?: string): IDatabaseSetting {
    // console.log("ENV:", settings);
    return settings.get(env || 'dev').database;
}

export function getServerInfo(env?: string): IServerSettings {
    return settings.get(env || 'dev').server;
}
