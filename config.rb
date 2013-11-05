environment = :development
#environment = :production

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "assets/css"
sass_dir = "assets/sass"
images_dir = "assets/img"
javascripts_dir = "assets/js"

require 'breakpoint'

# You can select your preferred output style here (can be overridden via the command line):
output_style = ( environment == :development ) ? :expanded : :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true
line_comments = ( environment == :development ) ? true : false
preferred_syntax = :sass

sass_options = ( environment == :development ) ? { :sourcemap => true } : {}