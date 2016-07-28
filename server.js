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

            if (err){
                console.error(err)
                res.json({
                    "ERROR"     : "Unable to execute charge credit card `charge-credit-card.rb`"
                })
            }
            else if (stderr){
                stderr = stderr.split(',')
                stderr = {
                    message             : stderr[1],
                    AuthOrErrorCode     : stderr[3],
                    TransIdOrErrorText  : stderr[5]
                }
                console.log(stderr)
                res.json({
                    "ERROR" : stderr
                })
            }
            else {
                stdout = stdout.split(',')
                stdout = {
                    Message             : stdout[1],
                    AuthOrErrorCode     : stdout[3],
                    TransIdOrErrorText  : stdout[5]
                }

                console.log(stdout)
                res.json({
                    "Response" : stdout
                })
            }
        } )
    }
    else {
        res.json({"ERROR" : "Not Enough Parameters were sent. At least cardnumber, exp date, ccv and ammount"})
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
                    "ERROR" : "Unable to execute void transaction `void-transaction.rb`"
                })
            }
            else if (stderr){
                stderr = stderr.split(',')
                stderr = {
                    Message             : stderr[1],
                    TransIdOrErrorCode  : stderr[3],
                    Text                : stderr[5]
                }
                console.log(stderr)
                res.json({
                    "ERROR" : stderr
                })
            }
            else {

                stdout = stdout.split(',')
                stdout =  {
                    Message             : stdout[1],
                    TransIdOrErrorCode  : stdout[3],
                    Text                : stdout[5]
                }

                res.json({
                    "Resonse" : stdout
                })
            }
        })
    }
    else {
        res.json({
            "ERROR" : "Not Enough Parameters were sent. We only need transid so you messed up fam"
        })
    }
})

//app.use('/transactions', router)

app.use(router)

app.listen(3000, function(err){
    if (err){
        console.error("There was an error starting the web server")
    }
    else {
        console.log('Server started and running on port 3000')
    }
})
