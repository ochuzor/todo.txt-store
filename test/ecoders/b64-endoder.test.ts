import {
    b64EncodeUnicode,
    b64DecodeUnicode,
} from '../../src/encoders/b64-encoder';

describe('b64-encoder:', () => {
    describe('b64EncodeUnicode:', () => {
        it('should encode unicode string', () => {
            expect(b64EncodeUnicode('✓ à la mode')).toEqual(
                '4pyTIMOgIGxhIG1vZGU='
            );
        });

        it('should encode newline string', () => {
            expect(b64EncodeUnicode('\n')).toEqual('Cg==');
        });
    });

    describe('b64DecodeUnicode:', () => {
        it('should decode unicode string', () => {
            expect(b64DecodeUnicode('4pyTIMOgIGxhIG1vZGU=')).toEqual(
                '✓ à la mode'
            );
        });

        it('should decode newline string', () => {
            expect(b64DecodeUnicode('Cg==')).toEqual('\n');
        });
    });

    describe('b64EncodeUnicode:b64DecodeUnicode', () => {
        it('should encode and decode back to the same string', () => {
            const str = 'a test string';
            expect(b64DecodeUnicode(b64EncodeUnicode(str))).toEqual(str);
        });
    });
});
