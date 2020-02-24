import {
    ITodoStore,
    ILocalStorageBaseType,
    ITodoDataExporter,
} from './store.types';
import { ITodoDoc } from './indexer.types';
import { ITodoListStringEncoder } from "./encoders/ITodoListStringEncoder.types";
import { LZCompressedStringEncoder } from "./encoders/lz-compressed-string-encoder";

export class LocalStorageTodoStore implements ITodoStore {
    constructor(
        private dataKey: string,
        private storage: ILocalStorageBaseType = window.localStorage,
        private _encoder: ITodoListStringEncoder = LZCompressedStringEncoder.FromJSON()
    ) {}

    writeData(data: ITodoDoc[]): void {
        this.storage.setItem(this.dataKey, this._encoder.encode(data));
    }

    readData(): ITodoDoc[] {
        const dataStr = this.storage.getItem(this.dataKey);
        if (!dataStr || dataStr.trim() === '') return [];
        const data = this._encoder.decode(dataStr);
        if (!Array.isArray(data)) throw new Error('Invalid Data');

        return data;
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
