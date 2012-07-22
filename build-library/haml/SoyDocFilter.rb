module Haml::Filters
    module SoyDoc
      include Haml::Filters::Base

      def render(text)
          "/**\n" + text.gsub(/^/m, " * ") + " */\n"
      end
    end
end
