# AuthNetBackend

This is the backend server for ElectronPOS. It has 3 main functionalities.

* It creates a transaction
* It voids a transaction
* It refunds a transaction

That's really it.

# Installation

In order to install just run the 2 commands below. After, you will need to configure
some environment variables

    $ npm install       # At least npm version 3.9.5 with and node version v6.2.2
    $ bundle install    # At least Bundler version 1.12.3 and gem version 2.5.1

### Using Authorize.net credentials
Right now we only support Authorize.net as our gateway, but eventually we will
implement support for other gateways.


open up your `.bashrc` or `.bash_profile` and create the following environment variables

    export EQ_AUTH_NET_NAME="your-authorize.net-login-id"
    export EQ_AUTH_NET_TRANS_KEY="your-authorize.net-transaction-key"

That's it for now. Either `source` your new bash configurations or restart bash.

### Now run the final command

    $ sudo node server.js --harmony

The `--harmony` flag is for arrow function support, just in case your node version is a little too low


# AuthNetBackend API

## Charge a card

    app.post('/charge', function(req, res){

        req.body.amount
        req.body.cardnumber
        req.body.ccv
        req.body.name
        req.body.expdate

        // then we charge your credit card
    })


##### Parameters

    Amount, CreditCardNumber, CCV, Name On Card, Exp Date

##### Response  

    Error   # (e.g. You messed it up bro, try again)

##### OR

    Authorization Code # (e.g. KUSI06)
    Transaction ID     # (e.g. 60005898263)

## Void a Transaction

    app.post('/void', function(req, res){
        req.body.transid
    })

##### Parameters

    Transaction ID # (e.g. Transaction ID from response above)

##### Response  

    Error   # (e.g. You messed it up bro, try again)

##### OR

    Success Code # (e.g. 1, 2, 3,  4 or 5)


## Refund a Transaction

    app.post('/refund', function(req, res){
        req.body.transid
    })

##### Parameters

    Transaction ID # (e.g. Transaction ID charge response above)

##### Response  

    Error   # (e.g. You messed it up bro, try again)

##### OR

    Success Code # (e.g. 1, 2, 3,  4 or 5)

# TODO

Eventually we will be integrating different gateway hooks so in an effort to keep the code the same on the client side, we are just going to handle the actual transactions on the server side. 
