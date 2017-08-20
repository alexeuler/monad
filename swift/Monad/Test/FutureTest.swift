//
//  FutureTest.swift
//  Monad
//
//  Created by Алексей Карасев on 20/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import XCTest

enum TestError: Error {
  case SomeError
}

class FutureTest: XCTestCase {
  func testPure() {
    let _ = Future<Error, Int>.pure(123).map { (value: Int) -> Int in
      XCTAssert(value == 123)
      return value
    }
  }
  
  func testFlatMap() {
    let success = { (value: Int) -> Future<Error, Int> in
      return Future<Error, Int> { (callback: (Either<Error, Int>) -> Void) -> Void  in
        callback(Either<Error, Int>.pure(value))
      }
    }
    let failure = { (err: Error) -> Future<Error, Int> in
      return Future<Error, Int> { (callback: (Either<Error, Int>) -> Void) -> Void  in
        callback(Either<Error, Int>.Left(err))
      }
    }
    let _ = success(123).map { (value: Int) -> Int in
      XCTAssert(value == 123)
      return value
    }
    let _ = failure(TestError.SomeError).map { (value: Int) -> Int in
      XCTAssert(false)
      return value + 123
    }
  }
}
