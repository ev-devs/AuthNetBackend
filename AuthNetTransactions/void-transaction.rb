require 'authorizenet'
include AuthorizeNet::API

transaction = Transaction.new( ARGV[0], ARGV[1] , :gateway => :sandbox)
authTransId = ARGV[2]
request = CreateTransactionRequest.new

request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.refTransId = authTransId
request.transactionRequest.transactionType = TransactionTypeEnum::VoidTransaction

response = transaction.create_transaction(request)

if response.messages.resultCode == MessageTypeEnum::Ok
    MESSAGE = "Successfully voided the transaction"
    TRANSID = response.transactionResponse.transId
    print "{ Message : " + MESSAGE + ", Transaction ID : " + TRANSID + " }"

else
    MESSAGE     = response.messages.messages[0].text
    ERRORCODE   = response.transactionResponse.errors.errors[0].errorCode
    ERRORTEXT   = response.transactionResponse.errors.errors[0].errorText
    print "{ Message : " + MESSAGE + ", Error Code : " + ERRORCODE + ", Error Text : " + ERRORTEXT + "}"
end
