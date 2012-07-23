module OpenMultimedia
  class Helper
    def param(name)
      if not defined? @params
        @params = {}
        if ENV["SASS_PARAMS"]
            ENV["SASS_PARAMS"].split(",").collect do |value|
              pieces = value.split("=")
              @params[pieces[0]] = ((pieces.length > 1) && pieces[1]) || "true"
            end
        end
      end
      @params[name]
    end
  end
end

$OpenMultimediaHelper = OpenMultimedia::Helper.new

module Sass::Script::Functions
    def param(name)
        val = $OpenMultimediaHelper.param(name.to_s)

        case val
        when "true" then
            Sass::Script::Bool.new(true)
        when "false", NilClass then
            Sass::Script::Bool.new(false)
        else
            Sass::Script::String.new(val)
        end
    end

    declare :param, [:name]
end
