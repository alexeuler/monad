//
//  Future.swift
//  Monad
//
//  Created by Алексей Карасев on 20/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

class Future<Err, A> {
  typealias Callback = (Either<Err, A>) -> Void
  
  var subscribers: Array<Callback> = Array<Callback>()
  var cache: Maybe<Either<Err, A>> = .None
  lazy var callback: Callback = {[weak self](value: Either<Err, A>) in
    guard let this = self else { return }
    this.cache = .Some(value)
    while (this.subscribers.count > 0) {
      let subscriber = this.subscribers.popLast()
      subscriber?(value)
    }
  }
  
  init(_ f: (@escaping Callback) -> Void) {
    f(self.callback)
  }
  
  func subscribe(_ callback: @escaping Callback) {
    switch cache {
    case .None:
      subscribers.append(callback)
    case .Some(let value):
      callback(value)
    }
  }
  
  static func pure<B>(_ value: B) -> Future<Err, B> {
    return Future<Err, B>({(callback: (Either<Err, B>) -> Void) in
      callback(Either<Err, B>.pure(value))
    })
  }
  
  func flatMap<B>(_ f: @escaping (A) -> Future<Err, B>) -> Future<Err, B> {
    return Future<Err, B>({[weak self](callback: @escaping (Either<Err, B>) -> Void) in
      guard let this = self else { return }
      this.subscribe({ (value: Either<Err, A>) in
        switch value {
        case .Left(let err):
          callback(Either<Err, B>.Left(err))
        case .Right(let x):
          f(x).subscribe(callback)
        }
      })
    })
  }
  
  func map<B>(_ f: @escaping (A) -> B) -> Future<Err, B> {
    return self.flatMap({ (x: A) -> Future<Err, B> in
      return Future<Err, B>.pure(f(x))
    })
  }
}
