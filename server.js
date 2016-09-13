'use strict'

const express       = require('express');
const app           = express();
const exec          = require('child_process').exec;
const logger        = require('morgan')
const bodyParser    = require('body-parser')

/*MIDDLEWARE*/
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

const EQ_NAME = process.env.EQ_AUTH_NET_NAME;
const EQ_KEY = process.env.EQ_AUTH_NET_TRANS_KEY;

const AuthNet = {
    chargeCreditCard    : "ruby ./AuthNetTransactions/charge-credit-card.rb " + EQ_NAME + " " + EQ_KEY,
    voidTransaction     : "ruby ./AuthNetTransactions/void-transaction.rb "   + EQ_NAME + " " + EQ_KEY,
    returnTransaction   : "ruby ./AuthNetTransactions/refund-transaction.rb " + EQ_NAME + " " + EQ_KEY
}

var router = express.Router();

router.get('/', function(req, res){
    res.json({
        "Welcome" : "to our API. This is the root endpoint and it does nothing"
    })
});


router.post('/authorize', function(req, res){
    if (req.guid){

    }
    else {
        res.send('We need a guid in order to createa device id')
    }
})

router.post('/charge', function(req, res){

    if (req.body.cardnumber && req.body.expdate && req.body.ccv && req.body.amount) {

        let TransactionString = AuthNet.chargeCreditCard + " " + req.body.cardnumber + " " + req.body.expdate + " " + req.body.ccv + " " + req.body.amount

        exec( TransactionString ,
        (err, stdout, stderr) => {
            console.log(stdout)
            if (err){
                console.error(err)
                res.json({
                    "error"     : "Unable to execute charge credit card `charge-credit-card.rb`"
                })
            }
            else {
                stdout = stdout.split(',')
                if (stdout[0] != "error"){
                    stdout = {
                        message     : stdout[2],
                        authCode    : stdout[4],
                        transId     : stdout[6]
                    }
                }
                else {
                    //console.log(stdout)
                    stdout = {
                        message         : stdout[2],
                        errorCode       : stdout[3].split(':')[1],
                        errorText       : stdout[4].split(':')[1]
                    }
                }
                res.json({
                    "response" : stdout
                })
            }
        } )
    }
    else {
        res.json({"error" : "Not Enough Parameters were sent. At least cardnumber, exp date, ccv and ammount"})
    }

})

router.post('/void', function(req, res){

    if (req.body.transId){

        let TransactionString = AuthNet.voidTransaction + " " + req.body.transId

        exec(TransactionString,
        (err, stdout, stderr) => {

            if (err){
                console.error(err)
                res.json({
                    "error" : "Unable to execute void transaction `void-transaction.rb`"
                })
            }
            else {
                console.log(stdout)
                stdout = stdout.split(',')

                if (stdout[0] != "error"){
                    stdout = {
                        message         : stdout[2],
                        responseCode    : stdout[4].split(':')[1],
                        code            : stdout[6].split(':')[1],
                        description     : stdout[8].split(':')[1]
                    }
                }
                else {

                    if ( stdout.length > 3) {
                        
                        stdout = {
                            message     : stdout[2],
                            errorCode   : stdout[4].split(':')[1],
                            errorText   : stdout[6]
                        }
                    }
                    else {
                        stdout = {
                            error : stdout[2]
                        }
                    }
                }
                res.json({
                    "response" : stdout
                })
            }
        })
    }
    else {
        res.json({
            "error" : "Not Enough Parameters were sent. We only need transId"
        })
    }
})

router.post('/return', function(req, res){

    if (req.body.cardnumber && req.body.cardname && req.body.amount){
        let TransactionString = AuthNet.returnTransaction + " " +req.body.cardnumber + " " + req.body.cardname + " " + req.body.amount
    }
    else {
        res.json({ "error" : "Not enough parameters were sent" })
    }
})


app.use(router)

app.listen(8085, function(err){
    if (err){
        console.error("There was an error starting the web server")
    }
    else {
        console.log('Server started and running on port 8085')
    }
})
