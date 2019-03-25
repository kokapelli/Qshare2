import { AxiosResponse } from "axios";

export interface InterfaceConnector {
    reset: () => void;
    get: (url: string) => Promise<AxiosResponse<any>>;
    post: (url: string, body?: {}) => Promise<AxiosResponse<any>>;
    put: (url: string, body?: {}) => Promise<AxiosResponse<any>>;
    delete: (url: string) => Promise<AxiosResponse<any>>;
}