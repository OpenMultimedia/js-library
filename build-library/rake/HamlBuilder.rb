module OpenMultimedia
  module HamlBuilder
    def haml_build(args)
      source = args[:source] || raise(ArgumentError, "source parameter required")
      target = args[:target] || raise(ArgumentError, "target parameter required")
      params = args[:params]

      command = [ "haml" ]

      command << "--require" << File.join( File.dirname(__FILE__), "..", "haml/SoyUtils" )
      command << "--require" << File.join( File.dirname(__FILE__), "..", "haml/SoyDocFilter" )

      if ( params and not params.empty? )
        ENV["HAML_PARAMS"] = (params.collect do |name, value|
          "#{name}=#{value}"
        end).join(",")
      else
        ENV.delete "HAML_PARAMS"
      end

      command << source << target

      log command.join(" ")

        when_writing("LOL") do
            system(*command) unless nowrite
        end
    end
  end
end
