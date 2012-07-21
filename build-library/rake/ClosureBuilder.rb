require "pathname"
require "fileutils"

module OpenMultimedia
  module ClosureBuilder
    def closure_library_path
      @closure_library_path ||= "closure-library"
    end

    def closure_library_path=(value)
      @closure_library_path = value
    end

    def closure_compiler_jar
      @closure_compiler_jar ||= "compiler/compiler.jar"
    end

    def closure_compiler_jar=(value)
      @closure_compiler_jar = value
    end

    def closure_stylesheets_jar
      @closure_stylesheets_jar ||= "closure-stylesheets/closure-stylesheets.jar"
    end

    def closure_stylesheets_jar=(value)
      @closure_stylesheets_jar = value
    end

    def closure_templates_jar
      @closure_templates_jar ||= "closure-templates-for-javascript/SoyToJsSrcCompiler.jar"
    end

    def closure_templates_jar=(value)
      @closure_templates_jar = value
    end

    def closure_templates_js_path
      @closure_templates_js_path ||= "closure-templates-for-javascript"
    end

    def closure_templates_js_path=(value)
      @closure_templates_js_path = value
    end

    def closure_build_dependencies(params)
      roots =  params[:roots] || raise(ArgumentError, "roots parameter required")
      output_path =  params[:output_path] || raise(ArgumentError, "output_path parameter required")

      if not roots.kind_of? Enumerable then
        roots = [ roots.to_s ]
      end

      command = [ "python", "#{closure_library_path}/closure/bin/build/depswriter.py" ]

      closure_library_goog_base_path = Pathname.new(File.absolute_path(File.join(closure_library_path, "closure/goog/")))

      roots.each do |path|
        absolute_path = Pathname.new( File.absolute_path(path) )
        relative_path = absolute_path.relative_path_from(closure_library_goog_base_path)

        command << "--root_with_prefix" << "'#{path}' '#{relative_path}'";
      end

      command << "--output_file" << output_path

      print "Ejecutando: #{(command.collect { |i| %Q["#{i}"] }).join(" ")}\n"

      system(*command)
    end

    def closure_templates_build(params)
      source = params[:source] || raise(ArgumentError, "source parameter required")
      output_path_format = params[:output_path_format] || raise(ArgumentError, "output_path_format parameter required")
      should_generate_jsdoc = params[:should_generate_jsdoc] || false
      should_provide_require_soy_namespaces = params[:should_provide_require_soy_namespaces] || false
      should_generate_goog_msg_defs = params[:should_generate_goog_msg_defs] || false
      use_goog_is_rtl_for_bidi_global_dir = params[:use_goog_is_rtl_for_bidi_global_dir] || false

      command = [ "java", "-jar", closure_templates_jar ]

      if should_generate_jsdoc
        command << "--shouldGenerateJsdoc"
      end

      if should_provide_require_soy_namespaces
        command << "--shouldProvideRequireSoyNamespaces"
      end

      if should_generate_goog_msg_defs
        command << "--shouldGenerateGoogMsgDefs"
      end

      if use_goog_is_rtl_for_bidi_global_dir
        command << "--useGoogIsRtlForBidiGlobalDir"
      end

      command << "--outputPathFormat" << output_path_format

      source.each do |file|
        command << file
      end

      print "Ejecutando: #{command.join(" ")}\n"
      system(*command)
    end

    def closure_stylesheets_build(params)
      source = params[:source] || raise(ArgumentError, "source param required")
      target = params[:target] || raise(ArgumentError, "target param required")
      pretty_print = params[:pretty_print]
      allow_unrecognized_properties = params[:allow_unrecognized_properties]
      allow_properties = params[:allow_properties]
      allow_unrecognized_functions = params[:allow_unrecognized_functions]
      allow_functions = params[:allow_functions]
      defines = params[:defines]

      command = [ "java", "-jar", closure_stylesheets_jar ]

      command << "--pretty-print" if pretty_print

      if defines
        defines.each do |define|
          command << "--define" << define
        end
      end

      command << "--allow-unrecognized-properties" if allow_unrecognized_properties

      command << "--allow-unrecognized-functions" if allow_unrecognized_functions

      if allow_properties
        allow_properties.each do |property|
          command << "--allowed-unrecognized-property" << property
        end
      end

      if allow_functions
        allow_functions.each do |function|
          command << "--allowed-non-standard-function" << function
        end
      end

      command << source

      command << "--output-file" << target

      print "Ejecutando: #{command.join(" ")}"

      system(*command)
    end

    def closure_build(params)
      roots = params[:roots] || nil
      files = params[:files] || nil
      inputs = params[:inputs] || nil
      namespaces = params[:namespaces] || nil

      if (not inputs) and (not namespaces)
        raise raise(ArgumentError, "inputs or namespaces parameter required")
      end

      defines = params[:defines] || []
      externs = params[:externs] || []
      debug = params[:debug] || false
      output_file = params[:output_file] || raise(ArgumentError, "output_file parameter required")
      output_mode = params[:output_mode] || "compiled"
      compiler_jar = params[:compiler_jar] || closure_compiler_jar
      compiler_summary_detail_level = params[:compiler_summary_detail_level] || 3
      compiler_warning_level = params[:compiler_warning_level] || "VERBOSE"
      compiler_compilation_level = params[:compiler_compilation_level] || "ADVANCED_OPTIMIZATIONS"
      compiler_process_closure_primitives = params[:compiler_process_closure_primitives] || true
      compiler_output_wrapper = params[:compiler_output_wrapper] || "(function(){%output%})();"
      compiler_warnings = params[:compiler_warnings]

      command = [ "python", "#{closure_library_path}/closure/bin/build/closurebuilder.py" ]

      command << "--output_mode" << "#{output_mode}"

      command << "--compiler_jar" << "#{compiler_jar}"

      command << "--compiler_flags" << "--summary_detail_level=#{compiler_summary_detail_level}"

      command << "--compiler_flags" << "--warning_level=#{compiler_warning_level}"

      command << "--compiler_flags" << "--compilation_level=#{compiler_compilation_level}"

      command << "--compiler_flags" << "--output_wrapper=#{compiler_output_wrapper}"

      if compiler_process_closure_primitives
        command << "--compiler_flags" << "--process_closure_primitives"
      end

      if debug
        print "Debugging\n---\n"
        command << "--compiler_flags" << "--define=goog.DEBUG=true"
        command << "--compiler_flags" << "--debug"
        command << "--compiler_flags" << "--formatting=PRETTY_PRINT"
      else
        command << "--compiler_flags" << "--define=goog.DEBUG=false"
      end

      if defines
        defines.each do |name, value|
          if value.kind_of? NilClass
            command << "--compiler_flags" << "--define=#{name}"
          elsif value.kind_of? Integer
            command << "--compiler_flags" << "--define=#{name}=#{value}"
          elsif value.kind_of? TrueClass
            command << "--compiler_flags" << "--define=#{name}=true"
          elsif value.kind_of? FalseClass
            command << "--compiler_flags" << "--define=#{name}=false"
          else
            command << "--compiler_flags" << "--define=#{name}='#{value}'"
          end
        end
      end

      if externs
        externs.each do |extern_file|
          command << "--compiler_flags" << "--externs=#{extern_file}" if extern_file
        end
      end

      if compiler_warnings
        compiler_warnings.each do |warning_code|
          command << "--compiler_flags" << "--jscomp_warning=#{warning_code}"
        end
      end

      command << "--root" << "#{closure_library_path}/closure"
      command << "--root" << "#{closure_library_path}/third_party/closure"

      if roots
        roots.each do |root_path|
          if root_path
            command << "--root" << root_path
          end
        end
      end

      command << "#{closure_templates_js_path}/soyutils_usegoog.js"

      if files
        files.each do |file|
          if file
            command << file
          end
        end
      end

      if inputs
        inputs.each do |input_file|
          if input_file
            command << "--input" << input_file
          end
        end
      end

      command << "--output_file" << output_file

      print "Ejecutando: #{ command.join(" ") }\n"

      system(*command)
    end

    ## Task Generators
    def closure_generate_stylesheets_build_task(args)
      source = args[:source] || raise(ArgumentError, "source required")
      target = args[:target] || raise(ArgumentError, "target required")
      clean_mode = args[:clean_mode] || :clobber
      params = args[:params] || {}

      file source do |task|
        if not File.exists?(source)
          raise "El archivo #{source} ya debe existir"
        end
      end

      desc "Compila la hoja de estilo a partir de las fuentes GSS: #{source}"
      file target => source do |task|
        closure_build_stylesheet source: source, target: target
      end

      case clean_mode
      when :clean then
        CLEAN.include target
      when :clobber then
        CLOBBER.include target
      end

      return target
    end
  end
end
