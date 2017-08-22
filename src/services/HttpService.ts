import { IConfigurationService } from './IConfigurationService';
import { injectable, inject } from 'inversify';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { HttpError, IServerConfiguration } from './../model/';
import { IHttpService } from './IHttpService';

@injectable()
export class HttpService implements IHttpService {

    private axios: AxiosInstance;

    private apiURL: string;

    public constructor( @inject("IConfigurationService") configurationService: IConfigurationService) {
        const serverConfig: IServerConfiguration = configurationService.getServerConfiguration();
        this.apiURL = serverConfig.BACKEND_API_URL;
        this.axios = require('axios');
    }

    public async get<T>(resource: string, queryParameters: any = {}): Promise<T> {
        return await this.axios.get(this.buildRequestUrl(resource), { params: queryParameters })
            .then((response: AxiosResponse) => {
                return response.data;
            }).catch((error: AxiosError) => {
                // TODO: LoggingService log error
                throw this.createHttpError(error);
            });
    }

    public async post<T>(resource: string, content: any): Promise<T> {
        return await this.axios.post(this.buildRequestUrl(resource), content)
            .then((response: AxiosResponse) => {
                return response.data;
            }).catch((error: AxiosError) => {
                // TODO: LoggingService log error
                throw this.createHttpError(error);
            });
    }

    public async put<T>(resource: string, content: any): Promise<T> {
        return await this.axios.put(this.buildRequestUrl(resource), content)
            .then((response: AxiosResponse) => {
                return response.data;
            }).catch((error: AxiosError) => {
                // TODO: LoggingService log error
                throw this.createHttpError(error);
            });
    }

    public async patch<T>(resource: string, content: any): Promise<T> {
        return await this.axios.patch(this.buildRequestUrl(resource), content)
            .then((response: AxiosResponse) => {
                return response.data;
            }).catch((error: AxiosError) => {
                // TODO: LoggingService log error
                throw this.createHttpError(error);
            });
    }

    public async delete<T>(resource: string): Promise<T> {
        return await this.axios.delete(this.buildRequestUrl(resource))
            .then((response: AxiosResponse) => {
                return response.data;
            }).catch((error: AxiosError) => {
                // TODO: LoggingService log error
                throw this.createHttpError(error);
            });
    }

    private buildRequestUrl(resource: string): string {
        return `${this.apiURL}/${resource}`;
    }

    private createHttpError(err: AxiosError): HttpError {
        return new HttpError(err.response.status, err.response.data, err);
    }

}
