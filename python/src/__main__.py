import http.client
import threading
import time
import os
from future import Future
from either import Either, Left, Right

conn = http.client.HTTPSConnection("en.wikipedia.org")

def read_file_sync(uri):
  base_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
  path = os.path.join(base_dir, uri)
  with open(path) as f:
    return f.read()

def fetch_sync(uri):
  conn.request("GET", uri)
  r = conn.getresponse()
  return r.read().decode("utf-8")[:200]

def read_file(uri):
  return Future.async(lambda: read_file_sync(uri))

def fetch(uri):
  return Future.async(lambda: fetch_sync(uri))

def main(args=None):
  lines = read_file("../resources/urls.txt").map(lambda res: res.splitlines())
  content = lines.flat_map(lambda urls: Future.traverse(urls)(fetch))
  output = content.map(lambda res: print("\n".join(res)))
  # output.map(lambda res: sema.release())
  # sema.acquire()

if __name__ == "__main__":
  main()