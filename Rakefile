#!/bin/env ruby
# encoding: utf-8

# INITIALIZATION
# Cambia el directorio de trabajo al directorio del Rakefile activo
chdir File.dirname(Rake.application.rakefile)
print "Ejecutando Rakefile desde: " << Dir.pwd << "\n" if verbose

require "rake/clean"
require "./build-library/rake/RakeBuilder"
require "pathname"

include OpenMultimedia::RakeBuilder

self.closure_templates_jar = ENV["CLOSURE_TEMPLATES_JAR"] if ENV["CLOSURE_TEMPLATES_JAR"]

@root_dir = "./openmultimedia"

@source_hamlsoy_extension = ".soy.haml"
@compiled_hamlsoy_extension = ".haml-out.soy"

@get_compiled_hamlsoy_filename = proc { |source_filename| swap_extension(source_filename, @source_hamlsoy_extension, @compiled_hamlsoy_extension) }
@get_source_hamlsoy_filename = proc { |compiled_filename| swap_extension(compiled_filename, @compiled_hamlsoy_extension, @source_hamlsoy_extension) }

@source_hamlsoy_files = FileList.new("#{@root_dir}/**/*#{@source_hamlsoy_extension}")
@compiled_hamlsoy_files = @source_hamlsoy_files.collect(&@get_compiled_hamlsoy_filename)

rule( @compiled_hamlsoy_extension => [ @get_source_hamlsoy_filename ]) do |task|

  puts("Construyendo plantilla HAML: #{task.source} => #{task.name}") if verbose

  when_writing("Ejecución del compilador HAML") do
    haml_build(source: task.source, target: task.name)
  end
end

CLEAN.include @compiled_hamlsoy_files

@source_soy_extension = ".soy"
@compiled_soy_extension = ".soy-out.js"

@get_compiled_soy_filename = proc { |source_filename| swap_extension(source_filename, @source_soy_extension, @compiled_soy_extension) }
@get_source_soy_filename = proc { |compiled_filename| swap_extension(compiled_filename, @compiled_soy_extension, @source_soy_extension) }

@source_soy_files = FileList.new( FileList.new("#{@root_dir}/**/*#{@source_soy_extension}") | @compiled_hamlsoy_files )
@compiled_soy_files = @source_soy_files.collect(&@get_compiled_soy_filename)

rule( @compiled_soy_extension => [ @get_source_soy_filename ]) do |task|
  Rake::Task[:build_soy_templates_bundle].invoke
end

CLOBBER.include @compiled_soy_files

desc "Construye el bundle de plantillas SOY"
task :build_soy_templates_bundle => @source_soy_files do |task|

  puts("Construyendo bundle de plantillas SOY") if verbose

  when_writing("Ejecución del compilador Closure Templates") do
    closure_templates_build(
      source: @source_soy_files,
      output_path_format: "{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}#{@compiled_soy_extension}",
      should_generate_jsdoc: true,
      should_provide_require_soy_namespaces: true,
      should_generate_goog_msg_defs: true,
      use_goog_is_rtl_for_bidi_global_dir: true
    )
  end
end

desc "Construye las plantillas"
task :build_templates => @compiled_soy_files

desc "Construye las plantillas"
task :build => :build_templates

desc "Construye las plantillas"
task :default => :build
