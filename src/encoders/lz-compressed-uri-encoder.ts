import { ITodoListStringEncoder } from ".";
import { ITodoDoc } from "../indexer.types";
import { JsonEncoder } from "./json-encoder";
import {compressToEncodedURIComponent, decompressFromEncodedURIComponent} from "lz-string";

export class LZCompressedUriEncoder implements ITodoListStringEncoder {
    constructor(private _encoder: ITodoListStringEncoder) {}

    static FromJSON(): LZCompressedUriEncoder {
        return new LZCompressedUriEncoder(new JsonEncoder());
    }

    encode(data: ITodoDoc[]): string {
        return compressToEncodedURIComponent(this._encoder.encode(data));
    }

    decode(data: string): ITodoDoc[] {
        return this._encoder.decode(decompressFromEncodedURIComponent(data));
    }
}
