import TextFileTodoStore from '../src/text-file-todo.store';
import { ITodoDoc } from '../src/indexer.types';

describe('TextFileTodoStore', () => {
    const fileName = 'fake-file-name';
    let MockFs: any;
    beforeEach(() => {
        MockFs = {
            existsSync: jest.fn(),
            readFileSync: jest.fn(),
            writeFileSync: jest.fn(),
        };
    });

    describe('FileExists', () => {
        it('should call fs existsSync', () => {
            MockFs.existsSync = jest.fn();
            TextFileTodoStore.FileExists(fileName, MockFs);
            expect(MockFs.existsSync).toHaveBeenCalledWith(fileName);
        });

        it('should return true if file exists', () => {
            MockFs.existsSync = jest.fn().mockReturnValue(true);
            const result = TextFileTodoStore.FileExists(fileName, MockFs);
            expect(result).toBeTruthy();
        });

        it('should return false if file does not exists', () => {
            MockFs.existsSync = jest.fn().mockReturnValue(false);
            const result = TextFileTodoStore.FileExists(fileName, MockFs);
            expect(result).toBeFalsy();
        });
    });

    describe('writeData', () => {
        describe('called with empty data list', () => {
            const data: ITodoDoc[] = [];
            let sut: TextFileTodoStore;

            beforeEach(() => {
                sut = new TextFileTodoStore(fileName, MockFs);
                sut.writeData(data);
            });

            it('should return call writeFileSync', () => {
                expect(MockFs.writeFileSync).toHaveBeenCalled();
            });

            it('...with an empty string', () => {
                expect(MockFs.writeFileSync).toHaveBeenCalledWith(fileName, '', 'utf8');
            });
        });

        describe('called with some data', () => {
            const data: ITodoDoc[] = [
                {id: 1, text: 'write a test'},
                {id: 2, text: 'write another test'},
            ];
            const expectedText: string = `${data[0].text}\n${data[1].text}`;
            let sut: TextFileTodoStore;

            beforeEach(() => {
                sut = new TextFileTodoStore(fileName, MockFs);
                sut.writeData(data);
            });

            it('should write the correct data', () => {
                expect(MockFs.writeFileSync)
                    .toHaveBeenCalledWith(fileName, expectedText, 'utf8');
            });
        });
    });

    describe('readData', () => {
        describe('given empty string input', () => {
            let sut: TextFileTodoStore;
            const expectedResult: ITodoDoc[] = [];

            beforeEach(() => {
                sut = new TextFileTodoStore(fileName, MockFs);
            });

            it('should return empty data list', () => {
                MockFs.readFileSync = jest.fn().mockReturnValue('');
                const result = sut.readData();
                expect(result).toEqual(expectedResult);
            });

            it('...even with multiple new lines', () => {
                MockFs.readFileSync = jest.fn().mockReturnValue('  \n  \n ');
                const result = sut.readData();
                expect(result).toEqual(expectedResult);
            });
        });

        describe('given a proper string input', () => {
            let result: ITodoDoc[];
            const expectedResult = [
                {id: 0, text: 'first item'},
                {id: 1, text: 'second item'},
            ];
            let sut: TextFileTodoStore;
            beforeEach(() => {
                MockFs.readFileSync = jest.fn().mockReturnValue(' first item \n second item  \n ');
                sut = new TextFileTodoStore(fileName, MockFs);
                result = sut.readData();
            });

            it('result should have the correct length', () => {
                expect(result).toHaveLength(2);
            });

            it('...and the proper data', () => {
                expect(result).toMatchObject(expectedResult);
            });
        });
    });

    describe('export()', () => {
        let sut: TextFileTodoStore;
        const data = [{id: 1, text: 'some texts'}, 
                {id: 2, text: 'other texts'}];
        const mockExporter = {
            export: jest.fn(),
        };

        beforeEach(() => {
            sut = new TextFileTodoStore(fileName, MockFs);
            sut.readData = jest.fn().mockReturnValue(data);
            sut.export(mockExporter);
        });

        it('should call exporter.export()', () => {
            expect(mockExporter.export).toBeCalledWith(data);
        });
    });
});