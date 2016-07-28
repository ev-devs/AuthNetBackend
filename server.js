'use strict'

var express = require('express');
var app = express();
const exec = require('child_process').exec;

console.log(process.env.EQ_URL)

const EQ_NAME = process.env.EQ_AUTH_NET_NAME;
const EQ_KEY = process.env.EQ_AUTH_NET_TRANS_KEY
const chargeCreditCard = "ruby AuthNetTransactions/charge-credit-card.rb " + EQ_NAME  + " " + EQ_KEY

app.get('/', function(req, res){

    exec( chargeCreditCard,
    (err, stdout, stderr) => {
        if (err){
            console.log(err)
            res.json({ "ERROR" : "Unable to execute charge credit card `ruby charge-credit-card.rb`"})
        }
        else {
            console.log(stdout)
            res.json({
                "SUCCESS" : stdout
            })
        }
    } )
})

app.listen(3000, function(){
    console.log('Server started and running on port 3000')
})
