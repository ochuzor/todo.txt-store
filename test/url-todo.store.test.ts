import {UrlTodoStore} from '../src/url-todo.store';

describe('UrlTodoStore:', () => {
    let locationObject: any;
    let encoder: any;
    let sut: any;

    beforeEach(() => {
        locationObject = {};

        encoder = {
            encode: jest.fn(),
            decode: jest.fn(),
        };

        sut = new UrlTodoStore(locationObject, encoder);
    });

    describe('writeData:', () => {
        const data: any = [];
        const encodedValue = 'AA-bb-CC'
        beforeEach(() => {
            encoder.encode = jest.fn().mockReturnValue(encodedValue);
            sut.writeData(data);
        });

        it('should call encoder.encode', () => {
            expect(encoder.encode).toBeCalledWith(data);
        });

        it('...and save its return value', () => {
            expect(locationObject.hash).toEqual(encodedValue);
        });
    });

    describe('readData:', () => {
        describe('with an empty hash string', () => {
            it('should return an empty array', () => {
                locationObject.hash = '';
                expect(sut.readData()).toEqual([]);
            });
        });

        describe('if decoded data is not array', () => {
            it('should throw an invalid data error', () => {
                const Sut = new UrlTodoStore({
                    hash: 'non-empty string'
                }, {
                    encode: jest.fn(),
                    decode: jest.fn().mockReturnValue('not an array'),
                });
                expect(() => Sut.readData()).toThrowError(/^Invalid Data$/);
            });
        });

        describe('when data is valid', () => {
            const mockTodoList = [{id: 200, text: '(B) add some more tests'}];
            const hashVal = 'hash-value';
            let result: any;
            beforeEach(() => {
                encoder.decode = jest.fn().mockReturnValue(mockTodoList);
                locationObject.hash = `#${hashVal}`;
                result = sut.readData();
            });

            it('should call decode with correct hash value', () => {
                // nb: minus the #
                expect(encoder.decode).toHaveBeenCalledWith(hashVal);
            });

            it('...and return its value', () => {
                expect(result).toMatchObject(mockTodoList);
            });
        });
    });

    describe('export:', () => {
        const data = [
            { id: 1, text: 'some texts' },
            { id: 2, text: 'other texts' },
        ];

        const mockExporter = {
            export: jest.fn(),
        };

        beforeEach(() => {
            sut.readData = jest.fn().mockReturnValue(data);
            sut.export(mockExporter);
        });

        it('should call exporter.export', () => {
            expect(mockExporter.export).toBeCalledWith(data);
        });
    });
});
