module.exports = function (grunt) {
    require('./src/define');

    grunt.initConfig({
        jshint: {
            files: {
                src: ['src/**/*.js', 'Gruntfile.js']
            }
        },
        jasmine_node: {
            specNameMatcher: "_ispec",
            projectRoot: ".",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: false,
                savePath: "./build/reports/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', 'Gruntfile.js'],
                tasks: ['jshint', 'jasmine_node'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint','jasmine_node']);
};