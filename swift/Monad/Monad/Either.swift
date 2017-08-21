//
//  Either.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

enum Either<A, B> {
  case Left(A)
  case Right(B)
  static func pure<C>(_ value: C) -> Either<A, C> {
    return Either<A, C>.Right(value)
  }
  
  func flatMap<D>(_ f: (B) -> Either<A, D>) -> Either<A, D> {
    switch self {
    case .Left(let x):
      return Either<A, D>.Left(x)
    case .Right(let x):
      return f(x)
    }
  }
  
  func map<C>(f: (B) -> C) -> Either<A, C> {
    return self.flatMap { Either<A, C>.pure(f($0)) }
  }
}
