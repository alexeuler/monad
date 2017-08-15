//
//  EitherTest.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//


import XCTest

class EitherTest: XCTestCase {
  func testPure() {
    switch Either<Any, Int>.pure(123) {
    case .Left:
      XCTAssert(false)
    case .Right(let x):
      XCTAssert(x == 123)
    }
  }
  
  func testFlatMap() {
    switch Either<String, Any>.Left("123").flatMap({ _ in Either<String, Int>.Right(123)}) {
    case .Left(let x):
      XCTAssert(x == "123")
    case .Right:
      XCTAssert(false)
    }
    
    switch Either<String, Int>.Right(123).flatMap({ _ in Either<String, Int>.Left("123")}) {
    case .Left(let x):
      XCTAssert(x == "123")
    case .Right:
      XCTAssert(false)
    }
    
    switch Either<String, Int>.Right(123).flatMap({ _ in Either<String, Int>.Right(234)}) {
    case .Left:
      XCTAssert(false)
    case .Right(let x):
      XCTAssert(x == 234)
    }
  }
}
