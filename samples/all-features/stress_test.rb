# Ruby Stress Test - Bloom Highlighter

module BloomSample
  class Highlighter
    include Enumerable

    attr_reader :theme, :version

    def initialize(theme = "Neon")
      @theme = theme
      @version = "0.6.0"
      @active = false
    end

    def activate!
      raise "Already active" if @active
      @active = true
      yield self if block_given?
    rescue => e
      puts "Failed to activate: #{e.message}"
    ensure
      puts "Activation attempt finished."
    end

    def process_data(items)
      return [] if items.nil? || items.empty?

      items.map do |item|
        if item.is_a?(String)
          item.upcase
        elsif item.is_a?(Numeric)
          item * 2
        else
          nil
        end
      end.compact
    end

    def check_logic(a, b)
      result = (a && b) || (a != b)
      puts "Result is: #{result}"
      result ? :ok : :error
    end

    private

    def _internal_helper
      @internal_state = :ready
    end
  end
end

highlighter = BloomSample::Highlighter.new
highlighter.activate! do |h|
  puts "Highlighter version #{h.version} is now active."
end

data = ["bloom", 42, nil, "ruby"]
processed = highlighter.process_data(data)
p processed
