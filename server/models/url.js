const { ConnectionClosedEvent } = require("mongodb");
const {getDb} = require("../db/conn");

class Url {
    constructor() {
    }

    setOriginalUrl(originalUrl) {
        this.originalUrl = originalUrl
    }

    setIdentifier(identifier) {
        this.identifier = identifier
    }

    setClickcount() {
        this.clickcount = 0
    }

    validateInputUrl() {    
        const httpRegex = /^http:\/\//
        const httpsRegex = /^https:\/\//
    
        var httpValid = this.originalUrl.match(httpRegex)
        var httpsValid = this.originalUrl.match(httpsRegex)
    
        if (!httpValid && !httpsValid) {
            console.log(httpValid)
            console.log(httpsValid)
            return false
        } else {
            console.log(httpValid)
            console.log(httpsValid)
            return true
        }    
    }

    generateRandomIdentifier(length) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result;
    }

    addUrlToDb() {
        const db = getDb()
        let myobj = {
            url_original: this.originalUrl,
            url_identifier: this.identifier,
            url_clickcount: this.clickcount
          }
        db.collection("urls").insertOne(myobj, function (err, res) {
          if (err) throw err;
          })
    }
}

module.exports = Url;