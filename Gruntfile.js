module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');
  //Each plugin must be loaded following this pattern
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
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
      myFiles: ['app.js','routes/**/*.js', 'public/travelapp/controllers/**/*.js']
    }
  });

  grunt.registerTask('default', 'mochaTest');


};