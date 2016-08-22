
let express =  require('express')
let nodeRouter = express.Router()

let chargeCreditCard    = require('./transactions/charge-credit-card.js')
let voidTransaction     = require('./transactions/void-transaction.js')
let refundTransaction   = require('./transactions/refund-transaction.js')

const EQ_NAME   = process.env.EQ_AUTH_NET_NAME
const EQ_KEY    = process.env.EQ_AUTH_NET_TRANS_KEY


nodeRouter.get('/', function(req, res){
    res.json( { Welcome : "To our API. This is the root endpoint and it does nothing" } )
})

/*
nodeRouter.post('/charge', function(req, res){

    if (req.body.cardnumber && req.body.expdate && req.body.ccv && req.body.amount)

    chargeCreditCard({
        EQ_NAME,
        EQ_KEY,

    })
})

nodeRouter.post('/void', function(req, res){
    voidTransaction()
})

nodeRouter.post('/refund', function(req, res){
    refundTransaction()
})

*/

module.exports = nodeRouter
