import { ITodoDoc } from './indexer.types';

export interface ITodoDataExporter {
    export(data: ITodoDoc[]): void;
}

export interface ITodoStore {
    writeData(data: ITodoDoc[]): void;
    readData(): ITodoDoc[];
    export(exporter: ITodoDataExporter): void;
}

export interface ILocalStorageBaseType {
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
}

export interface IFileSystemBaseType {
    existsSync(filePath: string): boolean;
    readFileSync(filePath: string, encoding: string): string;
    writeFileSync(filePath: string, data: string, encoding: string): void;
}

export interface IWindowLocationObject {
    hash: string;
}
