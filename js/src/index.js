import { Future } from './future';

// const f1 = Future.pure(12)
// f1.map(console.log)

const future = new Future(cb => setTimeout(() => cb(undefined, 20), 1000))
// console.log(future)
future.map(x => x + 5).map(console.log)

