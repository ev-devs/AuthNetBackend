require 'rubygems'
require 'yaml'
require 'authorizenet'

include AuthorizeNet::API

transaction = Transaction.new( ENV["EQ_AUTH_NET_NAME"] , ENV["EQ_AUTH_NET_TRANS_KEY"] , :gateway => :sandbox)

request = CreateTransactionRequest.new

request.transactionRequest = TransactionRequestType.new()
request.transactionRequest.amount = 16.00
request.transactionRequest.payment = PaymentType.new
request.transactionRequest.payment.creditCard = CreditCardType.new('4242424242424242','0220','123')
request.transactionRequest.transactionType = TransactionTypeEnum::AuthCaptureTransaction

response = transaction.create_transaction(request)

if response.messages.resultCode == MessageTypeEnum::Ok
  puts "Successful charge (auth + capture) (authorization code: #{response.transactionResponse.authCode}) (transaction ID: #{response.transactionResponse.transId})"

else
  puts response.messages.messages[0].text
  puts response.transactionResponse.errors.errors[0].errorCode
  puts response.transactionResponse.errors.errors[0].errorText
  raise "Failed to charge card."
end
