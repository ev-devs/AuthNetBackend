require 'authorizenet'
include AuthorizeNet::API

transaction = Transaction.new( ARGV[0] , ARGV[1] , :gateway => :sandbox)

CreditCardNumber = ARGV[2]
ExpirationDate = ARGV[3]
CCV = ARGV[4]
Amount = ARGV[5]

request = CreateTransactionRequest.new

request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = Amount
request.transactionRequest.payment = PaymentType.new
request.transactionRequest.payment.creditCard = CreditCardType.new(CreditCardNumber, ExpirationDate, CCV)
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
