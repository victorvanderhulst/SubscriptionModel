window.App = {
  ABI: [
	{
		"inputs": [],
		"name": "collectMonthlyFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "checkCurrentAllowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "daiToken",
		"outputs": [
			{
				"internalType": "contract DaiToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "monthlyFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "msgSender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "scAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "subscriptionBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
],
ABI_DAI: [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "guy",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "dst",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "src",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "dst",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
],
  bringGreeting: async function() {
    let msgSender = await App.contractInstance.methods.msgSender().call({from: App.currentAccount.toString()})
    let scAddress = await App.contractInstance.methods.scAddress().call()
    alert(`msgSender: ${msgSender} | scAddress: ${scAddress}`)
  },
  collectMonthlyFee: async function() {
    try {
      App.contractInstance.methods.collectMonthlyFee().send({from: App.currentAccount.toString()})
      .once('transactionHash', function(hash) {
        //Optionally do something once you get a transactionHash
        //(instantly on correct tx)
      })
      .once('receipt', async function(receipt) {
        //await App.bringGreeting()
        App.setCurrentAllowance()
        App.setCurrentDAIBalance()

        alert('Monthly fee paid. Thank you!')
      })
      .on('error', function(error) {
        throw(error)
      })
    } catch(err) {
      console.error(err)
    }

  },
  currentAccount: undefined,
  connectToWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
        console.log("User gave account access");
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    console.log(web3)
  },
  contractaddress: "0x4629a48107066A5Aa01F94eBE13400Da9cf419e4",
  contractaddress_DAI: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
  getContractInstance: function() {
      let abi = App.ABI
      let address = App.contractaddress
      return new web3.eth.Contract(abi, address)
  },
  getContractInstance_DAI: function() {
      let abi = App.ABI_DAI
      let address = App.contractaddress_DAI
      return new web3.eth.Contract(abi, address)
  },
  getCurrentAccount: async function() {
    try {
      return web3.eth.getAccounts(async function(err, accounts) {
        if(err != null) {
          throw("There was an error fetching your accounts.")
        } else if (accounts.length == 0) {
          throw("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        } else {
          return accounts[0]
        }
      })
    } catch(err) {
      alert(err)
    }
  },
  setCurrentAccount: function() {
    $("#currentAccount").html(App.currentAccount)
  },
  setCurrentAllowance: async function() {
    let allowance = await App.contractInstance.methods.checkCurrentAllowance().call({from: App.currentAccount.toString()})
    $("#currentAllowance").html(Web3.utils.fromWei(allowance, 'ether'))

  },
  setCurrentDAIBalance: async function() {
    let daiBalance = await App.contractInstance_DAI.methods.balanceOf(App.currentAccount.toString()).call()
    $("#currentDAIBalance").html(Web3.utils.fromWei(daiBalance, 'ether'))

    let daiBalanceSC = await App.contractInstance_DAI.methods.balanceOf(App.contractaddress.toString()).call()
    $("#collectedDAI").html(Web3.utils.fromWei(daiBalanceSC, 'ether'))


  },
  setApproval: async function() {
    try {
      let amount = $("#setApproval").val()
      amount = Web3.utils.toWei(amount, 'ether');

      App.contractInstance_DAI.methods.approve(App.contractaddress, amount).send({from: App.currentAccount.toString()})
      .once('transactionHash', function(hash) {
        //Optionally do something once you get a transactionHash
        //(instantly on correct tx)
      })
      .once('receipt', async function(receipt) {
        //await App.bringGreeting()
        App.setCurrentAllowance()
        alert('Allowance set. Thank you!')
      })
      .on('error', function(error) {
        throw(error)
      })
    } catch(err) {
      console.error(err)
    }
  },


  start: async function() {
    await App.connectToWeb3()
    App.currentAccount = await App.getCurrentAccount();
    App.contractInstance = App.getContractInstance();
    App.contractInstance_DAI = App.getContractInstance_DAI();
    App.setCurrentAccount()
    App.setCurrentAllowance()
    App.setCurrentDAIBalance()
    $("#scAddress").html(App.contractaddress)
    $("#daiAddress").html(App.contractaddress_DAI)

    //App.bringGreeting()
  }
}
$(function() {
  App.start()
})
