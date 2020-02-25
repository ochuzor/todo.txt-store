import { ITodoListStringEncoder, IStringEncoder } from './ITodoListStringEncoder.types';
import { ITodoDoc } from '../indexer.types';

export interface IJsonParser {
    stringify: (value: any) => string;
    parse: (value: string) => any;
}

export class NoOpStringEncoder implements IStringEncoder {
    encode(data: string): string {
        return data;
    }
    
    decode(data: string): string {
        return data;
    }
}

export class JsonEncoder implements ITodoListStringEncoder {
    constructor(private _parser: IJsonParser = JSON, 
        private _encoder: IStringEncoder = new NoOpStringEncoder()) {}
    
    static FromStringEcoder(stringEncoder: IStringEncoder): JsonEncoder {
        return new JsonEncoder(JSON, stringEncoder);
    }

    encode(data: ITodoDoc[]): string {
        return this._encoder.encode(
            this._parser.stringify(data));
    }

    decode(data: string): ITodoDoc[] {
        return this._parser.parse(
            this._encoder.decode(data));
    }
}
