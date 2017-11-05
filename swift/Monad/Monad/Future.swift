//
//  Future.swift
//  Monad
//
//  Created by Алексей Карасев on 20/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

let background = DispatchQueue(label: "background", attributes: .concurrent)

class Future<Err, A> {
  typealias Callback = (Either<Err, A>) -> Void
  
  var subscribers: Array<Callback> = Array<Callback>()
  var cache: Maybe<Either<Err, A>> = .None
  var semaphore = DispatchSemaphore(value: 1)

  lazy var callback: Callback = { value in
    self.semaphore.wait()
    self.cache = .Some(value)
    while (self.subscribers.count > 0) {
      let subscriber = self.subscribers.popLast()
      background.async {
        subscriber?(value)
      }
    }
    self.semaphore.signal()
  }
  
  init(_ f: @escaping (@escaping Callback) -> Void) {
    f(self.callback)
  }
  
  func subscribe(_ cb: @escaping Callback) {
    self.semaphore.wait()
    switch cache {
    case .None:
      subscribers.append(cb)
      self.semaphore.signal()
    case .Some(let value):
      self.semaphore.signal()
      cb(value)
    }
  }
  
  static func pure<B>(_ value: B) -> Future<Err, B> {
    return Future<Err, B> { $0(Either<Err, B>.pure(value)) }
  }
  
  func flatMap<B>(_ f: @escaping (A) -> Future<Err, B>) -> Future<Err, B> {
    return Future<Err, B> { [weak self] cb in
      guard let this = self else { return }
      this.subscribe { value in
        switch value {
        case .Left(let err):
          cb(Either<Err, B>.Left(err))
        case .Right(let x):
          f(x).subscribe(cb)
        }
      }
    }
  }
  
  func map<B>(_ f: @escaping (A) -> B) -> Future<Err, B> {
    return self.flatMap { Future<Err, B>.pure(f($0)) }
  }
  
  static func traverse<B>(_ list: Array<A>, _ f: @escaping (A) -> Future<Err, B>) -> Future<Err, Array<B>> {
    return list.reduce(Future<Err, Array<B>>.pure(Array<B>())) { (acc: Future<Err, Array<B>>, elem: A) in
      return acc.flatMap { elems in
        return f(elem).map { val in
          return elems + [val]
        }
      }
    }
  }
}
