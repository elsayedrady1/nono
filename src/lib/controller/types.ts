export enum ReflectKeys {
    Arguments = 'design:paramtypes',
    Body = 'body',
    Parameters = 'parameters',
    Request = 'request',
    Response = 'response',
    Method = 'method',
    Path = 'path',
    Validators = 'validators',
}

export interface IController {
    path: string;
}

export type Method = "get" | "post" | "put" | "patch" | "delete"