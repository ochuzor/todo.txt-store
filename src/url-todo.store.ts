import { ITodoDoc } from './indexer.types';
import {
    ITodoStore,
    ITodoDataExporter,
    IWindowLocationObject,
} from './store.types';
import { B64Ecoder } from './encoders/b64-encoder';
import { ITodoListStringEncoder } from './encoders';

export class UrlTodoStore implements ITodoStore {
    constructor(
        private _locationObject: IWindowLocationObject = window.location,
        private _encoder: ITodoListStringEncoder = B64Ecoder.FromJSON()
    ) {}

    writeData(data: ITodoDoc[]): void {
        this._locationObject.hash = this._encoder.encode(data);
    }

    readData(): ITodoDoc[] {
        const hash = (this._locationObject.hash || '').trim();
        if (hash === '') return [];

        const data = this._encoder.decode(hash.replace('#', ''));
        if (!Array.isArray(data)) throw new Error('Invalid Data');

        return data;
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
