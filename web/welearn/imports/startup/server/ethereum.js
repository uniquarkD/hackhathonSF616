import Web3 from 'web3'
import Tx from 'ethereumjs-tx'

const isProduction = false
const infuraKeys = Meteor.settings.private.infuraKeys
const infuraAccessToken = infuraKeys.accessToken
const wallKeysObj = Meteor.settings.private.wallKeysObj
const wallKeys = isProduction ? wallKeysObj.mainKeys : wallKeysObj.testKeysRopstein
const WALLET_ADDRESS = wallKeys.pubAddress
const WALLET_PRIVATE_KEY = wallKeys.privateKey
const CONTRACT_ADDRESS = wallKeys.contractAddress

const infuraEndPoints = {
  main: "https://mainnet.infura.io",
  rinkeby: "https://rinkeby.infura.io",
  ropstein: "https://ropsten.infura.io",
  kovan: "https://kovan.infura.io",
  ipfsGateway: "https://ipfs.infura.io",
  ipfsRPS: "https://ipfs.infura.io:5001 ",
}

const networkEndpoint = isProduction ? infuraEndPoints.main : infuraEndPoints.ropstein
const web3ProviderURL = `${networkEndpoint}/${infuraAccessToken}`

let web3
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider(web3ProviderURL))
}
web3.eth.defaultAccount = WALLET_ADDRESS


const getEthBalance = ({ walletAddress }) => {
  console.log('first')
  web3.eth.getBalance(walletAddress, function (error, result) {
    console.log('second')
    if (!error) {
      console.log("Before transfer: ", result)
    } else {
      console.log(error)
    }
  })
}

const abiArray = [
	{
		"constant": false,
		"inputs": [],
		"name": "donate",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "toAddress",
				"type": "address"
			},
			{
				"name": "testScore",
				"type": "int256"
			}
		],
		"name": "reward",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "balance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "bet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "MIN_SCORE",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "REWARD_UNIT",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export const sendTestResult = ({ userEthAddress, percentage }) => {
  let resultObj = { success: false }
  if (userEthAddress && percentage) {
    const myAddress = WALLET_ADDRESS;
    try {
      const count = Promise.await(web3.eth.getTransactionCount(myAddress))
      console.log(`num transactions so far: ${count}`);
      const contractAddress = CONTRACT_ADDRESS;
      const contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress
      });
      const gasPriceGwei = 100;
      const gasLimit = 4012388;
      // Chain ID of Ropsten Test Net is 3, replace it to 1 for Main Net; rinkeby - 4;
      const chainId = 3;
      const rawTransaction = {
          from: myAddress,
          nonce: `0x${count.toString(16)}`,
          gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
          gasLimit: web3.utils.toHex(gasLimit),
          to: contractAddress,
          value: "0x0",
          data: contract.methods.reward(userEthAddress, percentage).encodeABI(),
          chainId,
      };
      console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------`);
      // The private key for myAddress
      const privKey = new Buffer(WALLET_PRIVATE_KEY, 'hex');
      const tx = new Tx(rawTransaction);
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      console.log(`attempting to send signed tx: ${serializedTx.toString('hex')}\n-----`);
      /* Send the signed transaction */
      try {
        const receipt = Promise.await(web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`))
        // The receipt info of transaction
        console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------`);
        resultObj = { success: true }
      } catch (err) {
        console.log('Err: sendSignedTransaction ');
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return resultObj
}
