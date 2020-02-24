import { ITodoListStringEncoder } from "./ITodoListStringEncoder.types";
import { ITodoDoc } from "../indexer.types";
import { JsonEncoder } from "./json-encoder";
import { compress, decompress } from "lz-string";

export class LZCompressedStringEncoder implements ITodoListStringEncoder {
    constructor(private _encoder: ITodoListStringEncoder) { }
    static FromJSON(): LZCompressedStringEncoder {
        return new LZCompressedStringEncoder(new JsonEncoder());
    }
    encode(data: ITodoDoc[]): string {
        return compress(this._encoder.encode(data));
    }
    decode(data: string): ITodoDoc[] {
        return this._encoder.decode(decompress(data));
    }
}
