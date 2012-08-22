require "fileutils"
require "rake/clean"
require File.join(File.dirname(__FILE__), "HamlBuilder")
require File.join(File.dirname(__FILE__), "SassBuilder")
require File.join(File.dirname(__FILE__), "ClosureBuilder")

module OpenMultimedia
  module RakeBuilder
    include HamlBuilder
    include SassBuilder
    include ClosureBuilder

    def swap_extension(filename, original, replacement)
      original = Regexp.new(Regexp.quote(original) + '$') if String === original
      filename.gsub(original, replacement)
    end

    def notice(*args)
        cadenas = args.collect { |arg| "- " << arg }
        puts(*cadenas)
    end

    def log(*args)
        return if not verbose
        puts(*args)
    end

    def load(files)
        if not files.respond_to? 'each'
            puts "Loading files: %s" % [ files ] if verbose
            files = FileList.new files
        end

        files.each do |file|
            puts "Loading Rake file: %s" % [ file ] if verbose
            super file
        end
    end

    def import_file(args)
      source = args[:source] || raise(ArgumentError, "origin_file required")
      target = args[:target] || raise(ArgumentError, "origin_file required")

      target_dir = File.dirname(target)
      target_intermediate = File.join(target_dir, File.basename(source))

      if not File.exists? target_dir
        print "Creando directorio #{target_dir}\n" if verbose
        mkdir_p target_dir
      end

      remove(target_intermediate) if File.exists? target_intermediate
      remove(target) if File.exists? target

      print "Importando <#{source}> a <#{target}>\n" if verbose
      link(source, target)
    end

    ## Task Gens

    def generate_import_tasks(args)
      import_map = args[:import_map] || raise(ArgumentError, "import_map required")
      import_path = args[:import_path] || ""
      clean_mode = args[:clean_mode] || :clean

      imported_files = FileList.new

      import_map.each do |source, target|

        full_target = File.join(import_path, target)

        desc "Importa el archivo <#{source}> a #{full_target}"
        file full_target => source do |task|
          import_file(source: source, target: full_target)
        end

        if clean_mode == :clean
          CLEAN.include full_target
        elsif clean_mode == :clobber
          CLOBBER.include full_target
        end

        imported_files.add(full_target)
      end

      return imported_files
    end
  end
end
