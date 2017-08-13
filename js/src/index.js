import { Future } from './future';
import { Either, Left, Right } from './either';
// import { readFile } from 'fs';
// import https from 'https';

// const f1 = Future.pure(12)
// f1.map(console.log)

// const future = new Future(cb => setTimeout(() => cb(undefined, 20), 1000))
// console.log(future)
// future.map(x => x + 5).map(console.log)
// const future = new Future(cb => setTimeout(() => cb(undefined, 20), 1000))

// const future = Future.fromNode(readFile, 'resources/urls.txt')
// future.map(x => x.toString().split("\n")).map(console.log)

// try {
  // https.get('https://encrypted.google.com/', (err, data) => {
    // console.log("err", err);
    // console.log("data", data);
  // });
// }
// new Promise((resolve, reject) => readFile('resources/urls.txt', (err, data) => resolve(data))).then(console.log)
// setTimeout(() => {}, 2000);
// return future.toPromise()

const getUrl = url => 
  new Future(cb => https.get(url, res => {
    var body = '';
    res.on('data', data => body += data);
    res.on('end', data => cb(new Right(body)));
    res.on('error', err => cb(new Left(err)))
  }))

// const readFile = file => Future.fromNode(readFile, file)

// Future
//   .fromNode(readFile, 'resources/urls.txt')
//   .map(x => x.toString().split("\n"))
//   .map(console.log)

// https.get("https://google.com", (...args) => console.log(args))

const success = (x, cb) => cb(null, x)
// const fail = (err, cb) => cb(err, null)
// return Promise.all([
//   Future.fromNode(success, 'OK').map(x => expect(x).toBe('OK')).toPromise(),
//   Future.fromNode(fail, 'FAIL').map(x => expect(x).toBe('FAIL')).toPromise()
// ]).catch()
Future.fromNode(success, 'OK').map(x => x).toPromise().then(console.log);
