'use strict'

const express       = require('express');
const app           = express();
const exec          = require('child_process').exec;
const logger        = require('morgan')
const bodyParser    = require('body-parser')

console.log(process.env.EQ_URL)

/*MIDDLEWARE*/
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

const EQ_NAME = process.env.EQ_AUTH_NET_NAME;
const EQ_KEY = process.env.EQ_AUTH_NET_TRANS_KEY


const AuthNet = {
    chargeCreditCard : "ruby AuthNetTransactions/charge-credit-card.rb " + EQ_NAME  + " " + EQ_KEY,
    authorizeCreditCard : "",

}


var router = express.Router();

router.get('/', function(req, res){


});

router.post('/charge', function(req, res){

    if (req.body.cardnumber && req.body.expdate && req.body.ccv) {

        let TransactionString = AuthNet.chargeCreditCard + " " + req.body.cardnumber + " " + req.body.expdate + " " + req.body.ccv

        exec( TransactionString ,
        (err, stdout, stderr) => {

            if (err){
                console.error(err)
                res.json({
                    "ERROR"     : "Unable to execute charge credit card `charge-credit-card.rb`"
                })
            }
            else if (stderr){
                console.error(stderr)
                res.json({
                    "ERROR" : JSON.parse(JSON.stringify(stderr))
                })
            }
            else {
                console.log(stdout)
                res.json({
                    "Response" : JSON.parse(JSON.stringify(stdout))
                })
            }
        } )
    }
    else {
        res.json({"ERROR" : "Not Enough Parameters were sent. At least cardnumber, exp date and ccv"})
    }

})


router.post('/void', function(req, res){
    console.log(params)
    // we void an order here
})






app.use('/transactions', router)

app.listen(3000, function(err){
    if (err){
        console.error("There was an error starting the web server")
    }
    else {
        console.log('Server started and running on port 3000')
    }
})
