require 'authorizenet'
include AuthorizeNet::API

transaction = Transaction.new( ARGV[0] , ARGV[1] , :gateway => :sandbox)

CreditCardNumber = ARGV[2]
ExpirationDate = ARGV[3]
CCV = ARGV[4]
Amount = ARGV[5]

if ARGV.length < 5
    print "error,message,Not Enough Aruguments passed to charge-credit-card.rb"
end

request = CreateTransactionRequest.new
request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = Amount
request.transactionRequest.payment = PaymentType.new
request.transactionRequest.payment.creditCard = CreditCardType.new(CreditCardNumber, ExpirationDate, CCV)
request.transactionRequest.transactionType = TransactionTypeEnum::AuthCaptureTransaction

response = transaction.create_transaction(request)

if response.messages.resultCode == MessageTypeEnum::Ok
    MESSAGE     = "Successful charge (auth + capture)"
    AUTHCODE    = response.transactionResponse.authCode
    TRANSID     = response.transactionResponse.transId
    print "success,message," + MESSAGE + ",AuthorizationCode," + AUTHCODE + ",TransactionID," + TRANSID

else
    MESSAGE     = response.messages.messages[0].text
    ERRORCODE   = response.transactionResponse.errors.errors[0].errorCode
    ERRORTEXT   = response.transactionResponse.errors.errors[0].errorText
    print "error,message," + MESSAGE + ",ErrorCode," + ERRORCODE + ",ErrorText," + ERRORTEXT
end
