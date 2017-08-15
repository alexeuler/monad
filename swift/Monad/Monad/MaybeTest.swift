//
//  MaybeTestCase.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import XCTest

class MaybeTest: XCTestCase {

    override func setUp() {
        super.setUp()
    }
    
    override func tearDown() {
        super.tearDown()
    }

    func testPure() {
      switch Maybe<Any>.pure(123) {
      case .None:
        XCTAssert(false)
      case .Some(let x):
        XCTAssert(x == 123)
      }
    }
  
  func testFlatMap() {
    switch Maybe<Any>.None.flatMap({ _ in Maybe.Some(123)}) {
    case .Some:
      XCTAssert(false)
    case .None:
      XCTAssert(true)
    }
    
    switch Maybe.Some(123).flatMap({ _ in Maybe<Any>.None}) {
    case .Some:
      XCTAssert(false)
    case .None:
      XCTAssert(true)
    }

    switch Maybe.Some(123).flatMap({ _ in Maybe.Some(234)}) {
    case .Some(let x):
      XCTAssert(x == 234)
    case .None:
      XCTAssert(true)
    }

  }
}
