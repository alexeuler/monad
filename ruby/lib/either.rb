require_relative './monad'

class Either < Monad

  attr_accessor :is_left, :value

  # pure :: a -> Either a
  def self.pure(value)
    Right.new(value)
  end

  # pure :: a -> Either a
  def pure(value)
    self.class.pure(value)
  end

  # flat_map :: # Either a -> (a -> Either b) -> Either b
  def flat_map(f)
    if is_left
      self
    else
      f.call(value)
    end
  end
end

class Left < Either
  def initialize(value)
    @value = value
    @is_left = true
  end
end

class Right < Either
  def initialize(value)
    @value = value
    @is_left = false
  end
end


# puts Right.new(1).map(-> (x) { x + 1 }).value
# puts Right.new(1).map(-> (x) { x + 1 }).is_left
# puts Left.new(1).map(-> (x) { x + 1 }).value
# puts Left.new(1).map(-> (x) { x + 1 }).is_left
# puts Left.new(1).flat_map(-> (x) { Right.new(1000) }).value
# puts Left.new(1).flat_map(-> (x) { Right.new(1000) }).is_left