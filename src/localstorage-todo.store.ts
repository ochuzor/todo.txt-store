import {
    ITodoStore,
    ILocalStorageBaseType,
    ITodoDataExporter,
} from './store.types';
import { ITodoDoc } from './indexer.types';

export class LocalStorageTodoStore implements ITodoStore {
    constructor(
        private dataKey: string,
        private storage: ILocalStorageBaseType = window.localStorage
    ) {}

    writeData(data: ITodoDoc[]): void {
        this.storage.setItem(this.dataKey, JSON.stringify(data));
    }

    readData(): ITodoDoc[] {
        const dataStr = this.storage.getItem(this.dataKey);
        if (!dataStr || dataStr.trim() === '') return [];
        const data = JSON.parse(dataStr);
        if (!Array.isArray(data)) throw new Error('Invalid Data');

        return data;
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
