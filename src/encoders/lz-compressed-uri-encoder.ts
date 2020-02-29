import { IStringEncoder } from '.';
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
} from 'lz-string';

export class LZCompressedUriEncoder implements IStringEncoder {
    encode(text: string): string {
        return compressToEncodedURIComponent(text);
    }

    decode(text: string): string {
        return decompressFromEncodedURIComponent(text);
    }
}
