import { Constructor } from "../../shared/types";

export interface ValidationOptions {
    message?: string;
}

export type Validators = "number" | "string" | "boolean" | "array" | "integer" | "dto";

export type IValidator = {
    propertyKey: string;
    message: string
} & ({
    type: "dto"
    dto: Constructor<any>
} | {
    type: "string",
    min?: number,
    max?: number
} | {
    type: "number",
    min?: number,
    max?: number
} | {
    type: "boolean"
} | {
    type: "array",
    minItems?: number,
    maxItems?: number
} | {
    type: "integer",
    min?: number,
    max?: number
})