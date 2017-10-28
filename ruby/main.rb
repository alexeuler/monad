require './lib/future'
require 'net/http'
require 'uri'

semaphore = Queue.new

def read(uri)
  Future.async(-> () { File.read(uri) })
end

def fetch(url)
  Future.async(-> () {
    uri = URI(url)
    Net::HTTP.get_response(uri).body[0..200]
  })
end

read("resources/urls.txt")
  .map(-> (x) { x.split("\n") })
  .flat_map(-> (urls) {
    Future.traverse(urls, -> (url) { fetch(url) })
  })
  .map(-> (res) { puts res; semaphore.push(true) })

semaphore.pop
