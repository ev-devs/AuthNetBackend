require 'authorizenet'
include AuthorizeNet::API


if ARGV.length < 3
    print "error,message,Not Enough Aruguments passed to ruby void-transaction.rb"
    exit
end


transaction = Transaction.new( ARGV[0], ARGV[1] , :gateway => :sandbox)
authTransId = ARGV[2]



request = CreateTransactionRequest.new
request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.refTransId = authTransId
request.transactionRequest.transactionType = TransactionTypeEnum::VoidTransaction

response = transaction.create_transaction(request)


if response != nil
    if response.messages.resultCode == MessageTypeEnum::Ok
        if response.transactionResponse != nil && response.transactionResponse.messages != nil
            MESSAGE         = "Successfully voided the transaction"
            RESPONSECODE    = "Transaction Response code : #{response.transactionResponse.responseCode}"
            CODE            = "Code : #{response.transactionResponse.messages.messages[0].code}"
            DESCRIPTION     = "Description : #{response.transactionResponse.messages.messages[0].description}"
            print "success,message," + MESSAGE + ",responsecode," + RESPONSECODE + ",code," +  CODE + ",description," + DESCRIPTION
        else
            MESSAGE         = "Failed to void transaction"
            errorCode       = ""
            errorText       = ""
            if response.transactionResponse.errors != nil
              errorCode = "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
              errorText = "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
            end
            print "error,message," + MESSAGE + "," + ",ErrorCode," + errorCode + ",ErrorText," + errorText
        end
    else
        MESSAGE = "Failed to void transaction"
        errorCode = ""
        errorText = ""
        if response.transactionResponse != nil && response.transactionResponse.errors != nil
          errorCode = "Error Code : #{response.transactionResponse.errors.errors[0].errorCode}"
          errorTExt = "Error Message : #{response.transactionResponse.errors.errors[0].errorText}"
        else
          errorCode = "Error Code : #{response.messages.messages[0].code}"
          errorText = "Error Message : #{response.messages.messages[0].text}"
        end
        print "error,message," + MESSAGE + ",ErrorCode," + errorCode + ",errorText," + errorText
    end
else
    MESSAGE = "Failed to get response from Authorize.net"
    print "error,message," + MESSAGE
end
