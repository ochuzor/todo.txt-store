import fs from 'fs';
import { ITodoStore, ITodoDataExporter } from './store.types';
import { ITodoDoc } from './indexer.types';

export default class TextFileTodoStore implements ITodoStore {
    constructor(private _filePath: string, private _fileSystem = fs) {}

    static FromFile(filePath: string): TextFileTodoStore {
        return new TextFileTodoStore(filePath, fs);
    }

    static FileExists(file: string, _fileSystem = fs) {
        return _fileSystem.existsSync(file);
    }

    writeData(data: ITodoDoc[]): void {
        const _data = data.reduce((acc, doc) => `${acc} \n ${doc.text}`, '');
        this._fileSystem.writeFileSync(this._filePath, _data, 'utf8');
    }

    readData(): ITodoDoc[] {
        const textData = this._fileSystem.readFileSync(this._filePath, 'utf8');
        return (textData.split('\n')
            .filter(ln => !!ln)
            .map((line, i) => {
                return {id: 0, text: line};
            }));
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
