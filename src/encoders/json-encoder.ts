import { ITodoListStringEncoder } from './ITodoListStringEncoder.types';
import { ITodoDoc } from '../indexer.types';

export interface IJsonParser {
    stringify: (value: any) => string;
    parse: (value: string) => any;
}

export class JsonEncoder implements ITodoListStringEncoder {
    constructor(private _parser: IJsonParser = JSON) {}

    encode(data: ITodoDoc[]): string {
        return this._parser.stringify(data);
    }

    decode(data: string): ITodoDoc[] {
        return this._parser.parse(data);
    }
}
