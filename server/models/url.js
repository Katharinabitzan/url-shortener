const { ConnectionClosedEvent } = require("mongodb");
const dbo = require("../db/conn");

class Url {
    constructor(original, identifier) {
        this.original = original
        this.identifier = identifier
        this.db_connect = dbo.getDb()
    }

    // Validate the original url input by user to ensure it is the correct format with http or https
    validateInputUrl() {
        console.log("Url to validate is: " + this.original)
    
        const httpRegex = /^http:\/\//
        const httpsRegex = /^https:\/\//
    
        var httpValid = this.original.match(httpRegex)
        var httpsValid = this.original.match(httpsRegex)
    
        if (!httpValid && !httpsValid) {
            console.log("url invalid")
            return false
        } else {
            console.log("url valid")
            return true
        }    
    }

    async getDbRecordByIdentifier() {
        // Search DB for identifier. Return array of results]
        console.log("start Get DB record by identifier. Identifier is: " + this.identifier)

        const cursor = this.db_connect.collection("urls").find({ "url_identifier": this.identifier})
            console.log("cursor =" + cursor)

            const cursorArray = cursor.toArray().then((results) => {
                console.log("results are: " + results)
            })
            console.log("cursorArray = " + cursorArray )
            return cursorArray
        
        console.log("get DB record by identifier completed")
    }

    identifierUnique() {
        // Search DB for identifier return TRUE if unique or FALSE
        console.log("Running identifier unique function")

        let records = getDbRecordByIdentifier()
        if (records.length == 0) {
            console.log("identifier is unique")
            return true
        } else {
            console.log("identifier not unique")
            return false
        }
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
        console.log("Function to retrieve original URL called...")
        console.log("Identifier passed in is: " + identifier)
        console.log("Collection passed in is: " + collection)

        db.collection.findOne()
    }

    addUrlToDb() {
     //   let db_connect = dbo.getDb()
        let myobj = {
            url_original: this.original,
            url_identifier: this.identifier
          }
        this.db_connect.collection("urls").insertOne(myobj, function (err, res) {
          if (err) throw err;

       //   console.log(myobj)
        //  console.log(res)
          })
    }
}

module.exports = Url;