## My Implementation of the ECDSA Node Project

To keep it simple, I decide to go with an implementation where the user would have to put in his private key to derive and address.

The transaction is signed on the client and sent to the server. The secp256k1 library seems to have been updated as i couldn't find the 
recover public key from signature method. I did find a verifySignature fuction which confirms that a message has been signed by a particular user
(public key is provided), as well as recover public key from private key. 

So on the client side, once the private key is provided, the address is resolved using the recover public key from private key function. (I made the
address to be the "0x" attached to the last 10 characters of the public key). If a valid private key is provided the address is returned with the banlance
and a transfer can be made. Once a valid transfer is made, the amut is signed using the private key and sent to the server with the original amount and
also the public key (the private key is not sent to the server).

So when the server recives the transaction amount and a signature from the client, it then verifies that message is signed and valid. If the verifySignature
function returns true, then the server can go ahead and process the transfer, if not an error is returned
