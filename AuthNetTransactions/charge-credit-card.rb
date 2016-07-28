require 'authorizenet'
include AuthorizeNet::API

transaction = Transaction.new( ARGV[0] , ARGV[1] , :gateway => :sandbox)

request = CreateTransactionRequest.new

request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = 1000.90
request.transactionRequest.payment = PaymentType.new
request.transactionRequest.payment.creditCard = CreditCardType.new('4242424242424242','0220','123')
request.transactionRequest.transactionType = TransactionTypeEnum::AuthCaptureTransaction

response = transaction.create_transaction(request)

if response.messages.resultCode == MessageTypeEnum::Ok
    MESSAGE     = "Successful charge (auth + capture) "
    AUTHCODE    = response.transactionResponse.authCode
    TRANSID     = response.transactionResponse.transId
    print " { Message : " + MESSAGE + ", Authorization Code : " + AUTHCODE + ", Transaction ID : " + TRANSID + " }"

else
    MESSAGE     = response.messages.messages[0].text
    ERRORCODE   = response.transactionResponse.errors.errors[0].errorCode
    ERRORTEXT   = response.transactionResponse.errors.errors[0].errorText
    print " { Message : " + MESSAGE + ", Error Code : " + ERRORCODE + ", Error Text : " + ERRORTEXT + " }"
end
