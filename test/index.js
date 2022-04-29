// index.js

var express = require('express'); // (npm install --save express)
var expect = require('chai').expect;

// This is just for organisation and reporting
describe('Our application', function() {
    var app,
        date;

    // Timeout for tests that take too long
    this.timeout(5000);
    
    //This is called once before any of the tests in his block begin
    before(function(done) {
        app = express();
        // Any asynchronous action with a callback.
        app.listen(3000, function(err){
            if(err) { return done(err); }
            done();
        });
    });

    //This is called once before each of the tests in this block
    beforeEach(function() {
        date = new Date();
    });

    //This is called after all the tests in the block complete
    after(function() {
        console.log("Application tests are done!")
    });
    
    // This is called once after each of the tests in the block
    afterEach(function() {
        console.log("The date for that one was", date);
    })


    // This is the name of the test
    it('should understand basic mathematical principles', function(done) {
  
      // We want this test to pass.
      if (5 == 5) {
        // If the behavior is as expected, call done with no argument.
        done();
      } else {
        // Otherwise, call done with an error.
        done(new Error("Not sure what's happened."));
      }
  
    });

    describe('(deeper)', function() {
        before(function() {
            console.log("Begin going deeper")
        });

        it('should perform basic counting', function() {
            //This should pass
            if('abc'.length != 3) {
                // we dont want to get here
                throw new Error("oh no!");
            }
        });
    })
  
  });



describe('Our application should.. with chai and no callback (not async)', function() {
    it('should understand basic maths', function(){
        
        expect(5).to.equal(5);
        expect(5).to.not.equal(3);
    });
});

describe('Our application should.. pass an async function', function() {
    it('should understand basic maths', function(done){
        
        expect(5).to.equal(5);
        expect(5).to.not.equal(3);
        done()
    });
});