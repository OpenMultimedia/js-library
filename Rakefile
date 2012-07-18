#!/bin/env ruby
# encoding: utf-8

# INITIALIZATION
# Cambia el directorio de trabajo al directorio del Rakefile activo
chdir File.dirname(Rake.application.rakefile)
print "Ejecutando Rakefile desde: " << Dir.pwd << "\n" if verbose

require "rake/clean"
require "./build/rake/RakeBuilder"
require "pathname"

include OpenMultimedia::RakeBuilder

self.closure_templates_jar = ENV["CLOSURE_TEMPLATES_JAR"] if ENV["CLOSURE_TEMPLATES_JAR"]

task :build_templates do |task|
  haml_files = FileList.new("./openmultimedia/**/*.soy.haml")

  haml_files.each do |haml_file|
    target_file =  File.join( File.dirname(haml_file), File.basename(haml_file, ".soy.haml") << ".haml-out.soy")
    haml_build(source: haml_file, target: target_file)
  end

  soy_files = FileList.new("./openmultimedia/**/*.soy")

  closure_templates_build(
    source: soy_files,
    output_path_format: "{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.soy-out.js",
    should_generate_jsdoc: true,
    should_provide_require_soy_namespaces: true,
    should_generate_goog_msg_defs: true,
    use_goog_is_rtl_for_bidi_global_dir: true
  )
end

CLEAN.include "./openmultimedia/**/*.haml-out.soy"
CLOBBER.include "./openmultimedia/**/*.soy-out.js"

task :default => :build_templates
