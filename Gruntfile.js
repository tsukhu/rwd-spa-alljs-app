module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  //Each plugin must be loaded following this pattern
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  
  grunt.loadNpmTasks("grunt-jsbeautifier");
   
  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    // This line makes your node configurations available for use
    pkg: grunt.file.readJSON('package.json'),
    // This is where we configure JSHint
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      all: ['app.js','config/**','models/**/*.js','test/**/*.js','routes/**/*.js', 'public/travelapp/controllers/**/*.js','public/travelapp/directives/**/*.js','public/travelapp/services/**/*.js','!public/travelapp/directives/ng-google-chart.js'],
      options: {
                jshintrc: true
            }
    },
    jsbeautifier: {
            files: ['app.js','config/**','models/**/*.js','test/**/*.js','routes/**/*.js', 'public/travelapp/controllers/**/*.js','public/travelapp/directives/**/*.js','public/travelapp/services/**/*.js','public/travelapp/config/**/*.js'],
            options: {
                html: {
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u", "pre"],
                    wrapLineLength: 0
                },
                css: {
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
          }
  });

  grunt.registerTask('default', 'mochaTest');

  grunt.registerTask("precommit", ["jsbeautifier", "jshint"]);



};