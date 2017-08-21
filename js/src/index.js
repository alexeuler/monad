import { Future } from './future';
import { Either, Left, Right } from './either';
import { readFile } from 'fs';
import https from 'https';

const getResponse = url => 
  new Future(cb => https.get(url, res => {
    var body = '';
    res.on('data', data => body += data);
    res.on('end', data => cb(new Right(body)));
    res.on('error', err => cb(new Left(err)))
  }))

const getShortResponse = url => getResponse(url).map(resp => resp.substring(0, 200))

Future
  .fromNode(readFile, 'resources/urls.txt')
  .map(data => data.toString().split("\n"))
  .flatMap(urls => Future.traverse(urls)(getShortResponse))
  .map(console.log)
