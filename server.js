'use strict'

const express = require('express');
const app = express();
const exec = require('child_process').exec;
const logger = require('morgan')

console.log(process.env.EQ_URL)

/*MIDDLEWARE*/
app.use(logger('dev'))

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

    console.log(req.params)

    exec( AuthNet.chargeCreditCard,
    (err, stdout, stderr) => {

        if (err){
            console.error(err)
            res.json({
                "ERROR"     : "Unable to execute charge credit card `ruby charge-credit-card.rb`"
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
