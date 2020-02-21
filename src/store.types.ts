import { ITodoDoc } from "./indexer.types";

export interface ITodoDataExporter {
    export(data: ITodoDoc[]): void;
}

export interface ITodoStore {
    writeData(data: ITodoDoc[]): void;
    readData(): ITodoDoc[];
    export(exporter: ITodoDataExporter): void;
}


export interface IStorage {
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
}