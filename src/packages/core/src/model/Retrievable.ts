import { Connection } from "./Connection";

export interface Retrievable<T> { 
    new (connection: Connection, json: any): T; 
};