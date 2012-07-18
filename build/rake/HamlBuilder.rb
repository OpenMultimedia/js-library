module OpenMultimedia
  module HamlBuilder
    def haml_build(args)
      source = args[:source] || raise(ArgumentError, "source parameter required")
      target= args[:target] || raise(ArgumentError, "target parameter required")

      command = [ "haml" ]

      command << "--require" << File.join( File.dirname(__FILE__), "..", "haml/SoyUtils" )

      command << source << target

      print "Ejecutando: #{ command.join(" ")}\n"

      system *command
    end
  end
end
