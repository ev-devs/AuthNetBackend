require 'authorizenet'
include AuthorizeNet::API


if ARGV.length < 5
    print "error,message,Not Enough Aruguments passed to charge-credit-card.rb"
    exit
end


transaction = Transaction.new( ARGV[0] , ARGV[1] , :gateway => :sandbox)

CreditCardNumber = ARGV[2]
ExpirationDate = ARGV[3]
CCV = ARGV[4]
Amount = ARGV[5]



request = CreateTransactionRequest.new
request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = Amount
request.transactionRequest.payment = PaymentType.new
request.transactionRequest.payment.creditCard = CreditCardType.new(CreditCardNumber, ExpirationDate)
request.transactionRequest.transactionType = TransactionTypeEnum::AuthCaptureTransaction

response = transaction.create_transaction(request)


if response != nil
    if response.messages.resultCode == MessageTypeEnum::Ok
        if response.transactionResponse != nil && response.transactionResponse.messages != nil
            MESSAGE     = "Successful charge (auth + capture)"
            AUTHCODE    = response.transactionResponse.authCode
            TRANSID     = response.transactionResponse.transId
            print "success,message," + MESSAGE + ",AuthorizationCode," + AUTHCODE + ",TransactionID," + TRANSID
        else
            MESSAGE             = "Transaction failed"
            errorCode           = ""
            errorMessage        = ""
            if response.transactionResponse.errors != nil
                errorCode       = "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
                errorMessage    = "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
            end
            print "error,message," + MESSAGE + "," + errorCode + "," + errorMessage
        end

    else
        MESSAGE             = "Transaction failed"
        errorCode           = ""
        errorMessage        = ""
        if response.transactionResponse != nil && response.transactionResponse.errors != nil
          errorCode     =  "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
          errorMessage  =  "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
        else
          errorCode     = "Error Code : #{response.messages.messages[0].code}"
          errorMessage  = "Error Message : #{response.messages.messages[0].text}"
        end
        print "error,message," + MESSAGE + "," + errorCode + "," + errorMessage
    end
else
    MESSAGE     = "Authorze.net failed to give a response"
    ERRORCODE   = ""
    ERRORTEXT   = ""
    print "error, message," + MESSAGE + ", ErrorCode," + ERRORCODE + ",ErrorText," + ERRORTEXT
end
