import fs from 'fs';
import { ITodoStore, ITodoDataExporter } from './store.types';
import { ITodoDoc } from './indexer.types';

interface TFileSystem {
    existsSync(filePath: string): boolean;
    readFileSync(filePath: string, encoding: string): string;
    writeFileSync(filePath: string, data: string, encoding: string): void;
}

export default class TextFileTodoStore implements ITodoStore {
    constructor(
        private _filePath: string,
        private _fileSystem: TFileSystem = fs
    ) {}

    static FromFile(
        filePath: string,
        _fileSystem: TFileSystem = fs
    ): TextFileTodoStore {
        return new TextFileTodoStore(filePath, fs);
    }

    static FileExists(file: string, _fileSystem: TFileSystem = fs): boolean {
        return _fileSystem.existsSync(file);
    }

    writeData(data: ITodoDoc[]): void {
        const _data = data.reduce((acc, doc) => `${acc} \n ${doc.text}`, '');
        this._fileSystem.writeFileSync(this._filePath, _data, 'utf8');
    }

    readData(): ITodoDoc[] {
        const textData = this._fileSystem.readFileSync(this._filePath, 'utf8');
        return textData
            .split('\n')
            .filter(ln => !!ln)
            .map((line, i) => {
                return { id: 0, text: line };
            });
    }

    export(exporter: ITodoDataExporter): void {
        exporter.export(this.readData());
    }
}
