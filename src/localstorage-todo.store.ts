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
        const data = this.storage.getItem(this.dataKey);
        if (!data) return [];
        return JSON.parse(data);
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
