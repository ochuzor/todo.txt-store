A javascript library for working with and especially storing [todo.txt](https://github.com/todotxt/todo.txt) text data. It is written in TypeScript and has a few classes for easily working with todo.txt texts. To install use:

```
npm i @ochuzor/todo.txt-store 
```

There are two main things that you can get from this library: a store and a 'database-ish' class. A store has an interface as such:

```typescript
export interface ITodoStore {
    writeData(data: ITodoDoc[]): void;
    readData(): ITodoDoc[];
    export(exporter: ITodoDataExporter): void;
}
```
The writeData() method writes/saves the list of data into the underlying storage medium. 

The readData() method reads all the data currently stored in the medium and returns them as a list of ITodoDoc documents. 

The export() method uses the supplied exporter to export the data into another format. There is currently no implementation but I'll add one soon. 

The ITodoDoc represents a single todo document and has an interface:

```typescript
export interface ITodoDoc {
    id: IdType;
    text: string;
}
```

There are currently two *ITodoStore* implementation that you can use: *LocalStorageTodoStore* and *TextFileTodoStore*. The LocalStorageTodoStore is intended for the web while TextFileTodoStore is intended for the desktop, for  things like command line and electron.js apps.

Example usage for LocalStorageTodoStore:

```typescript
import { LocalStorageTodoStore } from '@ochuzor/todo.txt-store';

const STORAGE_KEY = '<your-localstorage-key>';
const todoStore = new LocalStorageTodoStore(STORAGE_KEY);

const lsTodos = todoStore.readData();
// lsTodos = [{id: 1, text: 'call Bob'}, ...];

// add more...
lsTodos.push({ id: 101, text: 'x add one more todo'});

// store the data to localstorage
todoStore.writeData(lsTodos);
```
NB: the LocalStorageTodoStore also takes a second *localstorage* param, which is intended for testing purposes. Or if you want to customize the localstorage behavior. If left out, it uses the window.localstorage object.

The TextFileTodoStore is used in similar way:
```typescript
import { TextFileTodoStore } from '@ochuzor/todo.txt-store';

// each line should represent one todo.txt item
// empty lines would be ignored
const fileName = '<path-to-your-todo.txt-file>';
const todoStore = new TextFile(fileName);
// ... then use as above

// the class also provides two convenient static functions
// to check if a file already exists, so you don't accidentally overwrite it
const isFileExist = TextFileTodoStore.FileExists('<path-to-your-todo.txt-file>');
// returns a boolean

// to just create a file store from an existing file
const store = TextFileTodoStore.FromFile('<path-to-your-todo.txt-file>');
// returns a newly created file store

// NB: if the file exists, it would be overwritten when you write to disk
```

The TextFileTodoStore stores the todo.txt items one item per line. It can load up and use a file written by hand or other tools. As long as the instructions [here](https://github.com/todotxt/todo.txt) are followed, it'll work fine.

Then there is the *TodoDb* class. This class uses an indexer and a store object to work with todos; kindda like a database (but not really). It's a combination of an indexer and a storage functionality. The indexer holds the list of todos in memory and provides a search functionality. The store keeps the data on *"permanent storage"*. How to use it:

```typescript
import { TodoDb } from '@ochuzor/todo.txt-store';

// you can use whichever store and indexer you want
// ofc, as long as it implementst the appropriate interface
const filePath = '<path-to-your-todo.txt-file>';
const store = TextFileTodoStore.FromFile(filePath);
const indexer = ... // <the indexer of choice> see below

const db = new TodoDb(indexer, store);
```

...then you can use it like an indexer for todo items. For ex: you can add items:
```typescript
db.addDoc({id: 1001, text: '(A) add a documentation'});
```

If the doc already exists, then it will be replaced. When you add a doc to the db, it is saved to the store automatically, e.g. the localstorage or a file on the filesystem, depending on the store you use.

You can also retrieve a doc
```typescript
db.getDoc(id);
```
If the doc is not found, a [null object](https://en.wikipedia.org/wiki/Null_object_pattern) is returned. A null object has an id (the one you supplied) and an empty string for text.

You can delete a doc.
```typescript
db.deleteDoc(id);
```
If the document to delete is not found, nothing happens. After a delete the underlying store data is updated as well.

The indexer object has the following interface:
```typescript
export interface ITodoIndexer {
    addDoc(doc: ITodoDoc): void;
    getDoc(id: IdType): ITodoDoc;
    deleteDoc(id: IdType): void;
    getAll(): ITodoDoc[];
    search(query: string): ITodoDoc[];
}
```

You can build one, or get one from [todo.txt-indexer](https://www.npmjs.com/package/@ochuzor/todo.txt-indexer).


## Final note
This was created purely for learning purposes. You can also take a look at the tests.