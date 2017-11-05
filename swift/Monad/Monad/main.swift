//
//  main.swift
//  Monad
//
//  Created by Алексей Карасев on 15/08/2017.
//  Copyright © 2017 Alexey Karasev. All rights reserved.
//

import Foundation

enum Err: Error {
  case Some(String)
}

func readFile(_ path: String) -> Future<Error, String> {
  return Future<Error, String> { callback in
    background.async {
      let url = URL(fileURLWithPath: path)
      let text = try? String(contentsOf: url)
      if let res = text {
        callback(Either<Error, String>.pure(res))
      } else {
        callback(Either<Error, String>.Left(Err.Some("Error reading urls.txt")))
      }
    }
  }
}

func fetchUrl(_ url: String) -> Future<Error, String> {
  return Future<Error, String> { callback in
    background.async {
      let url = URL(string: url)
      let task = URLSession.shared.dataTask(with: url!) {(data, response, error) in
        if let err = error {
          callback(Either<Error, String>.Left(err))
          return
        }
        guard let nonEmptyData = data else {
          callback(Either<Error, String>.Left(Err.Some("Empty response")))
          return
        }
        guard let result = String(data: nonEmptyData, encoding: String.Encoding.utf8) else {
          callback(Either<Error, String>.Left(Err.Some("Cannot decode response")))
          return
        }
        let index = result.index(result.startIndex, offsetBy: 200)
        callback(Either<Error, String>.pure(String(result[..<index])))
      }
      task.resume()
    }
  }
}

var result: Any = ""
let _ = readFile("\(projectDir)/Resources/urls.txt")
    .map { data -> [String] in
      data.components(separatedBy: "\n").filter { (line: String) in !line.isEmpty }
    }.flatMap { urls in
        return Future<Error, String>.traverse(urls) { url in
            return fetchUrl(url)
        }
    }.map { responses in
      print(responses)
    }

RunLoop.main.run()
