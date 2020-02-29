import { IStringEncoder } from './ITodoListStringEncoder.types';
import { compress, decompress } from 'lz-string';

export class LZCompressedStringEncoder implements IStringEncoder {
    encode(text: string): string {
        return compress(text);
    }

    decode(text: string): string {
        return decompress(text);
    }
}
