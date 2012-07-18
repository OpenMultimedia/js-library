# encoding: utf-8

require "rake/clean"

module OpenMultimedia
  module SassBuilder
    def sass_test_env()
      if not defined? @sass_installed
        print "Probando instalación de SASS: "
        if not @sass_installed = system("sass", "-v")
          print "SASS no está instalado\n"
        end
      end

      raise "SASS no esta instalado" unless @sass_installed
    end

    def sass_build(args)
      sass_test_env()

      source = args[:source] || raise(ArgumentError, "source param required")
      target = args[:target] || raise(ArgumentError, "target param required")
      no_cache = args[:no_cache] || true
      debug = args[:debug] || false
      style = args[:style] || :nested
      load_paths = args[:load_paths] || []
      load_paths = [ load_paths ] if not load_paths.kind_of?(Array)
      clean_mode = args[:clean_mode] || :clobber
      prerequisites = args[:prerequisites] || []
      prerequisites = [ prerequisites ] if not prerequisites.kind_of?(Array)

      command = [ "sass" ]

      command << "--debug-info" if debug

      command << "--no-cache" if no_cache

      command << "--style" << case style
      when :compact then "compact"
      when :compressed then "compressed"
      when :expanded then "expanded"
      else "nested"
      end

      load_paths.each do |path|
        command << "--load-path" << path
      end unless load_paths.nil?

      command << source << target

      print "Ejecutando: #{(command.collect { |e| "\"#{e}\"" }).join(" ")}\n" if verbose
      system *command
    end
  end
end
