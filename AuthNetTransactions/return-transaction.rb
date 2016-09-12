require 'authorizenet'
include AuthorizeNet::API


transaction = Transaction.new( ARGV[0], ARGV[1], :gateway => :sandbox)
request = CreateTransactionRequest.new


if ARGV.length < 5
    print "error,message,Not Enough Arguments passed to returns.rb"
    abort('error,message,Not Enough Arguments passed to returns.rb')
end

CreditCardNumber    = ARGV[2]
Amount              = ARGV[3]
NameOnCard          = ARGV[4]


request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = Amount
request.transactionRequest.payment = PaymentType.new                    # routing     account   name on card
request.transactionRequest.payment.bankAccount = BankAccountType.new(nil,'125000024','12345678', 'John Doe')
request.transactionRequest.transactionType = TransactionTypeEnum::RefundTransaction

response = transaction.create_transaction(request)


if response != nil
    if response.messages.resultCode == AuthorizeNet::API::MessageTypeEnum::Ok
        if response.transactionResponse != nil && (response.transactionResponse.messages != nil)
            MESSAGE         = "Successfully credited the bank account"
            RESPONSECODE    = "Transaction Response code : #{response.transactionResponse.responseCode}"
            CODE            = "Code : #{response.transactionResponse.messages.messages[0].code}"
            DESCRIPTION     = "Description : #{response.transactionResponse.messages.messages[0].description}"
            print "success", + "," + MESSAGE + "," + RESPONSECODE + "," + CODE + "," + DESCRIPTION
        else
            MESSAGE         = "Return Transaction failed"
            RESPONSECODE    = "Transaction Response code : #{response.transactionResponse.responseCode}"
            errorCode       = ""
            errorMessage    = ""
            if response.transactionResponse.errors != nil
                errorCode       = "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
                errorMessage    = "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
            end
            print "error" + "," + MESSAGE + "," + RESPONSECODE + "," + ERRORCODE + "," + ERRORMESSAGE

        end

    else
        MESSAGE             = "Return transaction failed"
        RESPONSECODE        = "Transaction Response code : #{response.transactionResponse.responseCode}"
        errorCode           = ""
        errorMessage        = ""
        if response.transactionResponse.errors != nil
            errorCode       = "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
            errorMessage    = "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
        end
        print "error" + "," + MESSAGE + "," + RESPONSECODE + "," + ERRORCODE + "," + ERRORMESSAGE
    end

else
    MESSAGE = "AUTHORZE.NET FAILED TO RESPOND"
    print "error," + MESSAGE
end
