const { ConnectionClosedEvent } = require("mongodb");
const dbo = require("../db/conn");

class Url {
    constructor(original, identifier) {
        this.original = original
        this.identifier = identifier
    }

    // Validate the original url inputted by user to ensure it is the correct format with http or https
    validateInputUrl() {
        console.log("Function to validate input URL called.")
        console.log("Url to validate is: " + this.original)
    
        const httpRegex = /^http:\/\//
        const httpsRegex = /^https:\/\//
    
        var httpValid = this.original.match(httpRegex)
        var httpsValid = this.original.match(httpsRegex)
    
        if (!httpValid && !httpsValid) {
            return false
        } else {
            return true
        }    
    }

    // Search the DB by the identifier to see if the identifier is unique or not
    identifierUnique() {
        // Search DB for identifier return TRUE if unique or FALSE
        console.log("Running identifier unique function")
        console.log("Collection below")
     //   console.log(dbo.getDb().collection('urls'))

        console.log(dbo.getDb().collection('urls').find({}))
    
    }

    // Generate a random combination of numbers and letters based on a desired length
    generateRandomIdentifier(length) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength))
        }
        console.log(result)
        return result;
    }

    generateShortenedUrl() {
        console.log("Function to generate shortened URL called.")
        identifierUnique()
    }

    retrieveOriginalUrl(collection, identifier) {
        console.log("Function to retrieve original URL called.")
        console.log("Identifier passed in is: " + identifier)
        console.log("Collection passed in is: " + collection)

        db.collection.findOne()
    }

    addUrlToDb() {
        let db_connect = dbo.getDb()
        let myobj = {
            url_original: this.original,
            url_identifier: this.identifier
          }
        db_connect.collection("urls").insertOne(myobj, function (err, res) {
          if (err) throw err;

          console.log(myobj)
          console.log(res)
          console.log("starting find")
          let retrieve = db_connect.collection("urls").find({ "url_identifier": "testapp"})
          })
          console.log(retrieve)
    }
}

module.exports = Url;