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
    chargeCreditCard    : "ruby AuthNetTransactions/charge-credit-card.rb " + EQ_NAME + " " + EQ_KEY,
    voidTransaction     : "ruby AuthNetTransactions/void-transaction.rb "   + EQ_NAME + " " + EQ_KEY,
    refundTransaction   : "ruby AuthNetTransactions/refund-transaction.rb " + EQ_NAME + " " + EQ_KEY
}

var router = express.Router();

router.get('/', function(req, res){
    res.json({
        "Welcome" : "to our API. This is the root endpoint and it does nothing"
    })
});

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
                    stdout = {
                        message     : stdout[2],
                        errorCode   : stdout[4],
                        errorText   : stdout[6]
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

    if (req.body.transid){

        let TransactionString = AuthNet.voidTransaction + " " + req.body.transid

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
                        message     : stdout[2],
                        transId     : stdout[4]
                    }
                }
                else {

                    stdout = {
                        message     : stdout[2],
                        errorCode   : stdout[4],
                        errorText   : stdout[6]
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
            "error" : "Not Enough Parameters were sent. We only need transid so you messed up fam"
        })
    }
})


app.use(router)

app.listen(3000, function(err){
    if (err){
        console.error("There was an error starting the web server")
    }
    else {
        console.log('Server started and running on port 3000')
    }
})
