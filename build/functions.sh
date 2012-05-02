#!/bin/bash

closure_stylesheets () {
pwd

    input=''
	output=''
	allow_prop=''
	allow_func=''

    while [ $1 ]
    do
        case "$1"  in
			"-out")
				shift
				output="$1"
				;;

			"-in")
				shift
				input="$input $1"
				;;

			"-allow-func")
				shift
				allow_function="$allow_function --allowed-non-standard-function $1"
				;;

			"-allow-prop")
				allow_function="$allow_prop --allowed-unrecognized-property $1"
				;;

		esac

        shift
    done

    java -jar "${CLOSURE_STYLESHEETS_PATH}" \
	$allow_prop \
	$allow_func \
    $input \
    > "$output"
}

closure_build () {
    debug=0
    root=''
    input=''
    output=''
    define=''
    extern=''

    while [ $1 ]
    do
        case $1 in
            '-debug')
                shift
                debug="$1"
            ;;

            '-root')
                shift
                root="$root --root=$1"
            ;;

            '-in')
                shift
                input="$input --input=$1"
            ;;

            '-out')
                shift
                output="$1"
            ;;

            '-def')
                shift
                define="$define --compiler_flags=--define=$1"
            ;;

            '-ext')
                shift
                extern="$extern --compiler_flags=--externs=$1"
            ;;
        esac
    shift
    done

    if [ $debug -eq 1 ]
    then
        python "${closure_library_path}/closure/bin/build/closurebuilder.py" \
        --output_mode=compiled \
        --compiler_jar="$CLOSURE_COMPILER_PATH" \
        --compiler_flags="--summary_detail_level=3" \
        --compiler_flags="--warning_level=VERBOSE" \
        --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
        --compiler_flags="--process_closure_primitives" \
        --compiler_flags="--formatting=PRETTY_PRINT" \
        --compiler_flags="--debug" \
        --compiler_flags="--define=goog.DEBUG=true" \
        $define \
        --compiler_flags="--externs=${closure_externs_path}/firebug.externs.js" \
        $extern \
        --compiler_flags="--output_wrapper=(function(){%output%})();" \
        --root="${closure_library_path}/closure" \
        --root="${closure_library_path}/third_party/closure" \
        --root="${openmultimedia_jslib_path}/openmultimedia" \
        --root="${telesur_jslib_path}/telesur" \
        $root \
        "${closure_templates_jslib_path}/soyutils_usegoog.js" \
        $input \
        > "$output"

    else

        python "${closure_library_path}/closure/bin/build/closurebuilder.py" \
        --output_mode=compiled \
        --compiler_jar="$CLOSURE_COMPILER_PATH" \
        --compiler_flags="--summary_detail_level=3" \
        --compiler_flags="--warning_level=VERBOSE" \
        --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS" \
        --compiler_flags="--process_closure_primitives" \
        --compiler_flags="--define=goog.DEBUG=false" \
        $define \
        --compiler_flags="--externs=${closure_externs_path}/firebug.externs.js" \
        $extern \
        --compiler_flags="--output_wrapper=(function(){%output%})();" \
        --root="${closure_library_path}/closure" \
        --root="${closure_library_path}/third_party/closure" \
        --root="${openmultimedia_jslib_path}/openmultimedia" \
        --root="${telesur_jslib_path}/telesur" \
        $root \
        "${closure_templates_jslib_path}/soyutils_usegoog.js" \
        $input \
        > "$output"

    fi
}
