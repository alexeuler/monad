//
//  monad.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

class Monad<A> {
  init() {}
  
  static func pure<B>(_ value: B) -> Monad<B> {
    return Monad<B>.init()
  }
  func flatMap<B>(_ f: (A) -> Monad<B>) -> Monad<B> {
    return Monad<B>.init()
  }
  
  func map<B>(f: (A) -> B) -> Monad<B> {
    return self.flatMap({ (x: A) -> Monad<B> in
      return type(of: self).pure(f(x))
    })
  }
}

