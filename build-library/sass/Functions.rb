module OpenMultimedia
  class Helper
    def params
      if not defined? @params
        @params = {}
        ENV["SASS_PARAMS"].split(",").collect do |value|
          pieces = value.split("=")
          @params[pieces[0]] = ((pieces.length > 1) && pieces[1]) || true
        end
      end
      @params
    end
  end
end

$OpenMultimediaHelper = OpenMultimedia::Helper.new

module Sass::Script::Functions
  def self.debug
    Sass::Script::Bool.new($OpenMultimediaHelper.params["debug"] == "true")
  end
end
