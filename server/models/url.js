const { ConnectionClosedEvent } = require("mongodb");
const dbo = require("../db/conn");

class Url {
    constructor() {
    }

    // Set original URL
    setOriginalUrl(originalUrl) {
        this.originalUrl = originalUrl
    }

    // Set identifier
    setIdentifier(identifier) {
        this.identifier = identifier
    }

    // Validate the original url input by user to ensure it is the correct format with http or https
    validateInputUrl() {
        console.log("Url to validate is: " + this.originalUrl)
    
        const httpRegex = /^http:\/\//
        const httpsRegex = /^https:\/\//
    
        var httpValid = this.originalUrl.match(httpRegex)
        var httpsValid = this.originalUrl.match(httpsRegex)
    
        if (!httpValid && !httpsValid) {
         //   console.log("url invalid")
            return false
        } else {
         //   console.log("url valid")
            return true
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
        return result;
    }

    addUrlToDb() {
        const db = dbo.getDb()

        let myobj = {
            url_original: this.originalUrl,
            url_identifier: this.identifier
          }
        db.collection("urls").insertOne(myobj, function (err, res) {
          if (err) throw err;
          })
    }
}

module.exports = Url;