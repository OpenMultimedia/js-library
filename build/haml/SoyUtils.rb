module OpenMultimedia
  module Soy
    module Commands
      def Commands.css(class_name)
        "{css #{class_name}}"
      end
    end

    module Utils
      class CssClassChain
        @haml_buffer = nil
        @class_chain = nil

        def initialize(haml_buffer)
          @haml_buffer = haml_buffer
          @class_chain = Array.new
        end

        def make
          (@class_chain.select {|item| item } ).join("-")
        end

        def set(class_suffix)

          class_suffix = class_suffix.to_s.strip

          if class_suffix.empty? then
            @class_chain[ @haml_buffer.tabulation ] = nil
          else
            @class_chain[ @haml_buffer.tabulation ] = class_suffix
          end

          @class_chain = @class_chain.slice(0, @haml_buffer.tabulation + 1)
        end

        def get(class_suffix, extra = nil)
          set(class_suffix)
          if extra then
            {:class => Commands.css(make << "-" << extra)}
          else
            {:class => Commands.css(make)}
          end
        end
      end
    end
  end
end

