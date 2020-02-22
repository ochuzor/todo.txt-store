import { ITodoIndexer, ITodoDoc, IdType } from './indexer.types';
import { ITodoStore, ITodoDataExporter } from './store.types';

export class TodoDb<TIndexer extends ITodoIndexer, TStore extends ITodoStore>
    implements ITodoIndexer, ITodoStore {
    constructor(private _indexer: TIndexer, private _store: TStore) {}

    addDoc(doc: ITodoDoc): void {
        this._indexer.addDoc(doc);
        this.saveAllAsync();
    }

    getDoc(id: IdType): ITodoDoc {
        return this._indexer.getDoc(id);
    }

    deleteDoc(id: IdType): void {
        this._indexer.deleteDoc(id);
        this.saveAllAsync();
    }

    getAll(): ITodoDoc[] {
        return this._indexer.getAll();
    }

    search(query: string): ITodoDoc[] {
        return this._indexer.search(query);
    }

    writeData(data: ITodoDoc[]): void {
        this._store.writeData(data);
    }

    readData(): ITodoDoc[] {
        return this._store.readData();
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }

    protected saveAllAsync(): Promise<void> {
        return new Promise(resolve => {
            this.writeData(this.getAll());
            resolve();
        });
    }
}
