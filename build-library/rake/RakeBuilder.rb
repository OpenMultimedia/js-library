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
        log "load %s" % [ files ]
        files = FileList.new files
      end

      files.each do |file|
        log "load %s" % [ file ]
        super file
      end
    end

    ## Task Gens

    def generate_import_tasks(args)
      import_map = args[:import_map] || raise(ArgumentError, "import_map required")
      import_path = args[:import_path] || ""
      clean_mode = args[:clean_mode] || :clean

      imported_files = FileList.new

      import_map.each do |source, target|

        full_target = File.join(import_path, target)

        target_dir = File.dirname full_target

        directory target_dir

        ## desc "Importa el archivo <#{source}> a #{full_target}"
        file full_target => [source, target_dir] do |task|
          link(source, full_target)
        end

        if clean_mode == :clean
          CLEAN.include full_target
        elsif clean_mode == :clobber
        CLEAN.include full_target
          CLOBBER.include full_target
        end

        imported_files.add(full_target)
      end

      return imported_files
    end
  end
end
