import http.client
import threading
import time
import os
from future import Future
from either import Either, Left, Right

conn = http.client.HTTPSConnection("en.wikipedia.org")

def read_file_sync(uri, cb):
  base_dir = os.path.dirname(__file__) #<-- absolute dir the script is in
  path = os.path.join(base_dir, uri)
  try:
    with open(path) as f:
      data = f.read()
    cb(Right(data))
  except OSError as err:
    cb(Left(err))

def read_file(uri):
  def read_async(cb):
    t = threading.Thread(target=read_file_sync, args=[uri, cb])
    t.start()
  return Future(read_async)

def fetch_sync(uri, cb):
  conn.request("GET", uri)
  try:
    r = conn.getresponse()
    data = r.read()
    cb(Right(data))
  except OSError as err:
    cb(Left(err))

def fetch(uri):
  def fetch_async(cb):
    t = threading.Thread(target=fetch_sync, args=[uri, cb])
    t.start()
  return Future(fetch_async)


def main(args=None):
  lines = read_file("../resources/urls.txt").map(lambda res: res.splitlines())
  content = lines.flat_map(lambda urls: Future.traverse(urls)(fetch))
  content.map(lambda res: print(res))
  time.sleep(5)

if __name__ == "__main__":
  main()