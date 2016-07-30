require 'authorizenet'
include AuthorizeNet::API

transaction = Transaction.new( ARGV[0], ARGV[1] , :gateway => :sandbox)
authTransId = ARGV[2]

if ARGV.length < 3
    print "message , Not Enough Aruguments passed to ruby void-transaction.rb"
end

request = CreateTransactionRequest.new
request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.refTransId = authTransId
request.transactionRequest.transactionType = TransactionTypeEnum::VoidTransaction

response = transaction.create_transaction(request)

if response.messages.resultCode == MessageTypeEnum::Ok

    if response.transactionResponse.transId != "0"
        MESSAGE = "Successfully voided the transaction"
        TRANSID = response.transactionResponse.transId
        Text    = ""
        print "success,message," + MESSAGE + ",TransactionID," + TRANSID + ',' + "Text," + Text
    else
        MESSAGE     = response.messages.messages[0].text
        ERRORCODE   = response.transactionResponse.errors.errors[0].errorCode
        ERRORTEXT   = response.transactionResponse.errors.errors[0].errorText
        print "error,message," + MESSAGE + ",ErrorCode," + ERRORCODE + ",ErrorText," + ERRORTEXT
    end

else
    MESSAGE     = response.messages.messages[0].text
    ERRORCODE   = response.transactionResponse.errors.errors[0].errorCode
    ERRORTEXT   = response.transactionResponse.errors.errors[0].errorText
    print "error,message," + MESSAGE + ",ErrorCode," + ERRORCODE + ",ErrorText," + ERRORTEXT
end
