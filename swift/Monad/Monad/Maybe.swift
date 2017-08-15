//
//  option.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

enum Maybe<A> {
  case None
  case Some(A)
  
  static func pure<B>(_ value: B) -> Maybe<B> {
    return .Some(value)
  }
  
  func flatMap<B>(_ f: (A) -> Maybe<B>) -> Maybe<B> {
    switch self {
    case .None:
      return .None
    case .Some(let value):
      return f(value)
    }
  }
  
  func map<B>(f: (A) -> B) -> Maybe<B> {
    return self.flatMap({ (x: A) -> Maybe<B> in
      return type(of: self).pure(f(x))
    })
  }
}

