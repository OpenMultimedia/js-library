# encoding: utf-8

require "rake/clean"

module OpenMultimedia
  module SassBuilder
    def sass_test_env()
      if not defined? @sass_installed
        notice "Probando instalación de SASS: "
        if not @sass_installed = system("sass", "-v")
          notice "SASS no está instalado"
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
      style = args[:style] || "nested"
      compass = args[:compass] || false
      load_paths = args[:load_paths] || []
      load_paths = [ load_paths ] if not load_paths.kind_of?(Array)
      clean_mode = args[:clean_mode] || :clobber
      prerequisites = args[:prerequisites] || []
      prerequisites = [ prerequisites ] if not prerequisites.kind_of?(Array)
      params = args[ :params ] || []

      command = [ "sass" ]

      command << "--require" << File.join( File.dirname(__FILE__), "..", "sass/Functions" )

      params[ "debug" ] = "true" if debug;

      if ( params and not params.empty? )
        ENV["SASS_PARAMS"] = (params.collect do |name, value|
          "#{name}=#{value}"
        end).join(",")
      else
        ENV.delete "SASS_PARAMS"
      end

      command << "--debug-info" if debug

      command << "--no-cache" if no_cache

      command << "--style" << style

      command << "--compass" if compass

      load_paths.each do |path|
        command << "--load-path" << path
      end unless load_paths.nil?

      command << source << target

      log((command.collect { |e| "\"#{e}\"" }).join(" "))

      system(*command) unless nowrite

    end
  end
end
