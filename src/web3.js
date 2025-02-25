const { ethereum } = window;
import axios from 'axios';
import Web3 from "web3";
import {
    Multicall
} from 'ethereum-multicall';
import liquidityPoolAbi from "./liquidityPool_abi.json";
import { maxTxLimit, lockerAddress, swapTokenLockerFactory, airdropAddress, DEFAULT_ILOCKER_CONTRACT, lockerContractAbi, erc20Abi } from './constants';
export const serverApi = 'http://localhost:5000/api';
export const provider = {
    "Ethereum": "https://mainnet.infura.io/v3/3587df9c45a740f9812d093074c6a505",
    "Goerli": "https://goerli.infura.io/v3/3587df9c45a740f9812d093074c6a505",
    "Binance Smart Chain": "https://data-seed-prebsc-1-s1.binance.org:8545",
    "Binance": "https://data-seed-prebsc-1-s1.binance.org:8545",
    "Binance_testnet": "https://data-seed-prebsc-1-s1.binance.org:8545",
    "Avalanche": "https://api.avax.network/ext/bc/C/rpc",
    "Avalanche_testnet": "https://api.avax-test.network/ext/bc/C/rpc",
    "Kekchain_testnet": "https://testnet.kekchain.com",
    "Kekchain": "https://mainnet.kekchain.com",
    "Frenchain_testnet": "https://rpc-01tn.frenchain.app",
    "Frenchain": "https://rpc-02.frenscan.io"
};
export const explorer = {
    "Ethereum": "https://etherscan.io",
    "Goerli": "https://goerli.etherscan.io",
    "Binance Smart Chain": "https://bscscan.com",
    "Binance": "https://bscscan.com",
    "Binance_testnet": "https://testnet.bscscan.com",
    "Avalanche": "https://snowtrace.io",
    "Avalanche_test": "https://testnet.snowtrace.io",
    "Kekchain": "https://mainnet-explorer.kekchain.com",
    "Kekchain_testnet": "https://testnet-explorer.kekchain.com",
    "Frenchain": "https://frenscan.io",
    "Frenchain_testnet": "https://testnet.frenscan.io"
};
export const deposit = async (provider, isEth, token, amount, date, account, holder, network, gasLimit) => {
    let result;
    try {
        let unlockDate = new Date(date);
        let UTCTimestamp = Math.round(unlockDate.getTime() / 1000)
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        let feeInETH = await contract.methods.feesInETH().call();
        feeInETH = parseFloat(web3.utils.fromWei(feeInETH.toString(), "ether")) * parseFloat(1.5);
        feeInETH = await web3.utils.toWei(feeInETH.toString(), "ether");
        console.log("depositing: ", isEth, lockerAddress[network], feeInETH, token, web3.utils.toWei(amount.toString(), 'ether'), UTCTimestamp, account, holder, network)
        if (isEth == false) {
            if (feeInETH) {
                result = await contract.methods["createLock"](token, isEth, holder, web3.utils.toWei(amount.toString(), 'ether'), UTCTimestamp).send({ from: account, value: feeInETH, gasLimit: gasLimit });
                console.log("deposited: ", result);
                return result;
            } else {
                return false;
            };
        } else {
            let sendingEther;
            sendingEther = parseFloat(web3.utils.fromWei(feeInETH.toString(), "ether")) + parseFloat(amount);
            sendingEther = await web3.utils.toWei(sendingEther.toString(), "ether");
            if (feeInETH) {
                result = await contract.methods["createLock"](account, isEth, holder, web3.utils.toWei(amount.toString(), 'ether'), UTCTimestamp).send({ from: account, value: sendingEther, gasLimit: gasLimit });
                console.log("deposited: ", result);
                return result;
            } else {
                return false;
            };
        }
    } catch (e) {
        console.log(e);
    };
}

export const w3 = async (provider, network) => {
    let w3;
    try {
        let web3 = new Web3(provider);
        w3 = web3;
        return w3;
    } catch (e) {
        console.log(e);
        return;
    };
}

export const myLocks = async (provider, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        let ml = await contract.methods.myLocks_().call();
        let glr = await contract.methods.getLocks_Range().call();
        console.log("myLocks_: ", ml, glr, account, network)
        if (ml) {
            //
        };
    } catch (e) {
        console.log(e);
    };
}

export const transferOwnership_iLock = async (provider, lockId, account, to, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        console.log("myLocks_: ", account, to, lockId, network);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        result = await contract.methods["transferFrom"](account, to, lockId).send({ from: account });
        return result.status;
    } catch (e) {
        console.log("yo: ", e);
    };
}


export const bridgeToken = async (provider, token, amount, date, account, holder, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        let feeInETH = await contract.methods.feesInETH().call();
        feeInETH = feeInETH * 2;
        console.log("bridge: ", feeInETH, token, amount, account, holder, network)
        if (feeInETH) {
            //
        };
    } catch (e) {
        console.log(e);
    };
}

export const updateProfile = async (provider, newLocker, token, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        let lastLockId = await contract.methods.lastLockId().call();
        let myLocks_ = await contract.methods.myLocks_().call();
        console.log("updateProfile: ", lastLockId, newLocker, myLocks_, token, account, network, myLocks_[myLocks_.length - 1], myLocks_.length);
        return await getLocker(provider, myLocks_[myLocks_.length - 1], account, network);
    } catch (e) {
        console.log(e);
    };
}

export const withdraw = async (provider, id, account, receiver, isETH, network, ownable, gasLimit) => {
    let result;
    console.log("withdraw: ", id, account, receiver, isETH, network, ownable, gasLimit);
    try {
        let web3 = new Web3(provider);
        if (ownable !== true) {
            const contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
            let feeInETH = await contract.methods.feesInETH().call();
            feeInETH = feeInETH * 10;
            feeInETH = web3.utils.fromWei(feeInETH.toString(), "ether");
            feeInETH = web3.utils.toWei(feeInETH.toString(), "ether");
            result = await contract.methods["withdraw"](id, receiver, isETH).send({ from: account, value: feeInETH, gasLimit: gasLimit });
            console.log("withdrawn: ", result);
            return result;
        } else {
            const contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
            let feeInETH = await contract.methods.feesInETH().call();
            feeInETH = feeInETH * 1.0103090031291;
            feeInETH = web3.utils.fromWei(feeInETH.toString(), "ether");
            feeInETH = web3.utils.toWei(feeInETH.toString(), "ether");
            result = await contract.methods["withdraw"](id, receiver, isETH).send({ from: account, value: feeInETH, gasLimit: gasLimit });
            console.log("withdrawn: ", result);
            return result;
        }
    } catch (e) {
        console.log(e);
    };
}

export const isLockClaimed = async (provider, id, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        const contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        result = await contract.methods["myiLock"](id).call();
        console.log("isLockClaimed: ", id, account, result);
        return result;
    } catch (e) {
        console.log(e);
    };
}

export const approve = async (provider, token, account, lockAmount, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(erc20Abi, token); {
            /*
             * // web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935")
             */
        }
        result = await contract.methods["approve"](lockerAddress[network], lockAmount).send({ from: account });
        if (result.status) {
            return result.status;
        } else {
            console.log("results: ", result);
        }
    } catch (e) {
        console.log(e);
    };
}

export const approveToken = async (provider, token, account, deployedContract) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(erc20Abi, token);
        result = await contract.methods["approve"](deployedContract, web3.utils.toBN("115792089237316195423570985008687907853269984665640564039457584007913129639935")).send({ from: account });
        return result.status;
    } catch (e) {
        console.log(e);
    };
}

export const allowance = async (token, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider[network]);
        let contract = new web3.eth.Contract(erc20Abi, token);
        result = await contract.methods["allowance"](account, lockerAddress[network]).call();
        return result;
    } catch (e) {
        console.log(e);
    };
}

export const getTokenBalance = async (token, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider[network]);
        let contract = new web3.eth.Contract(erc20Abi, token);
        result = await contract.methods["balanceOf"](account).call();
        return result;
    } catch (e) {
        console.log(e);
    };
}

export const getERC20balance = async (provider, token, account, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(erc20Abi, token);
        result = await contract.methods["balanceOf"](account).call();
        return result;
    } catch (e) {
        console.log(e);
    };
}

export const getERC20allowance = async (provider, token, account, spender, network) => {
    let result;
    try {
        let web3 = new Web3(provider);
        let contract = new web3.eth.Contract(erc20Abi, token);
        result = await contract.methods["allowance"](account, spender).call();
        return result;
    } catch (e) {
        console.log(e);
    };
}

export const getEtherBalance = async (provider, account) => {
    let balance;
    try {
        let web3 = new Web3(provider);
        console.log("get_ether_balance_account: ", account)
        await web3.eth.getBalance(account, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                balance = web3.utils.fromWei(result, "ether");
                console.log("get_ether_balance: ", web3.utils.fromWei(result, "ether"));
            };
        });
        if (balance) {
            return balance;
        };
    } catch (e) {
        console.log("hmm: ", e);
    };
}

export const getTokenData = async (token, account, network) => {
    let result;
    try {
        // erc20Abi = [{ "inputs": [{ "internalType": "string", "name": "__name", "type": "string" }, { "internalType": "string", "name": "__symbol", "type": "string" }, { "internalType": "uint256", "name": "supply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];
        let web3 = new Web3(provider[network]);
        let contract = new web3.eth.Contract(erc20Abi, token);
        let name = await contract.methods["name"]().call({ from: account });
        let decimals = await contract.methods["decimals"]().call({ from: account });
        let symbol = await contract.methods["symbol"]().call({ from: account });
        let balanceOf = await contract.methods["balanceOf"](account).call({ from: account });
        let getLock = [{ "data": ["data"], "token": ["token"], "holder": getLock["holder"], "balanceOf": balanceOf, "name": getLock["name"], "symbol": getLock["symbol"], "decimals": getLock["decimals"] }];
        console.log("iLock", getLock)
        let result = [{ "getLock": getLock, "data": ["data"], "holder": getLock["holder"], "token": ["token"], "balanceOf": balanceOf, "name": getLock["name"], "symbol": getLock["symbol"], "decimals": getLock["decimals"] }];
        return result;
    } catch (e) {
        console.log("px", e);
    };
}

export const getRawData = async (account, network) => {
    try {
        let web3 = new Web3(provider[network]);
        let contract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
        let depositIds = await contract.methods["getAllDepositIds"]().call();
        if (!depositIds.length) return []
        const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
        let contractCallContext = {
            reference: "lockedToken",
            contractAddress: lockerAddress[network],
            abi: lockerContractAbi,
            calls: depositIds.map(each => {
                return { reference: 'lockedTokensCall', methodName: 'lockedToken', methodParameters: [each] }
            })
        }
        let response = await multicall.call(contractCallContext);
        const returnValues = [];
        response.results.lockedToken.callsReturnContext.map(each => {
            const returnValue = {
                id: each.methodParameters[0],
                token: each.returnValues[0],
                owner: each.returnValues[1],
                amount: BigInt(parseInt(each.returnValues[2].hex, 16)).toString(),
                timestamp: parseInt(each.returnValues[3].hex, 16),
                isWithdrawn: each.returnValues[4]
            }
            if (returnValue.owner.toLowerCase() === account.toLowerCase()) returnValues.push(returnValue);
        });
        return returnValues;
    } catch (e) {
        console.log(e);
    };
}

export const get_Data = async (account, network) => {
    let lockerDataByWallet;
    console.log("account: ", account);
    console.log("network: ", network);
    try {
        let web3 = new Web3(provider[network]);
        const tokenContract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network], account);
        let latest_lockId = await tokenContract.methods.lastLockId().call({ from: account });
        console.log("latest_lockId: ", latest_lockId[0], latest_lockId[1]);
        let lid_1 = latest_lockId[0];
        let lid_2 = latest_lockId[1];
        if (lid_1 > 0 || lid_2 > 0) {
            let getLock = await tokenContract.methods.getLock(1).call({ from: account });
            lockerDataByWallet = [{ "data": ["data"], "token": [getLock["token"]], "lockToken": getLock["token"], "unclaimed": getLock["unclaimed"], "unlockTimestamp": getLock["unlockTimestamp"], "lockId": getLock["lockId"], "holdingContract": getLock["holdingContract"], "amount": getLock["amount"], "getLock": [getLock], "lockerAddress": [lockerAddress[network]] }];
        } else {
            lockerDataByWallet = [{ "data": ["data"], "token": ["token"] }];
        };
        if (lid_1 !== lid_2) {
            console.log("liquidity mismatch");
        } else {
            console.log("liquidity match");
        }
        return lockerDataByWallet;
    } catch (e) {
        console.log(e);
        return [{ "data": ["data"], "token": ["token"] }];
    };
}
export const getData = async (account, network) => {
    let lockerDataByWallet;
    console.log("account: ", account);
    console.log("network: ", network);
    try {
        let web3 = new Web3(provider[network]);
        const tokenContract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network], account);
        let latest_lockId = await tokenContract.methods.lastLockId().call({ from: account });
        let x = 0;
        let l_arr = [];
        let iLock = {
            "lockId": "",
            "holdingContract": "",
            "token": "",
            "amount": "",
            "getLock": "",
            "holder": "",
            "lockerAddress": "",
            "locker": ""
        };
        while (x < latest_lockId) {
            let getLock = await tokenContract.methods.getLock(x).call({ from: account });
            console.log("getLock: ", getLock);
            iLock = {
                "lockId": getLock["lockId"],
                "holdingContract": getLock["holdingContract"],
                "token": getLock["token"],
                "amount": getLock["amount"],
                "holder": getLock["holder"],
                "getLock": [getLock],
                "lockerAddress": lockerAddress[network],
                "locker": lockerAddress[network]
            }
            l_arr.push(iLock);
            if (x == latest_lockId - 1) {
                break;
            } else {
                x++;
            };
        };
        lockerDataByWallet = [{ "data": l_arr, "token": ["token"], "getLock": [l_arr] }];
        return lockerDataByWallet;
    } catch (e) {
        console.log(e);
        return [{ "data": ["data"], "token": ["token"] }]
    };
};
export const getLocker = async (provider_, lockId, account, network) => {
    let lockerDataByWallet;
    try {
        let web3 = new Web3(provider[network]);
        const tokenContract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network], account);
        tokenContract.options.address = lockerAddress[network];
        if (tokenContract.options.address !== null || tokenContract.options.address !== undefined) {
            let getLock = await tokenContract.methods.getLock(lockId).call({ from: account });
            console.log("getLock: ", getLock, account);
            lockerDataByWallet = [{ "data": ["data"], "token": [getLock["token"]], "Ether": getLock["Ether"], "creator": getLock["creator"], "holder": getLock["holder"], "lockToken": getLock["token"], "unclaimed": getLock["unclaimed"], "unlockTimestamp": getLock["unlockTimestamp"], "lockId": getLock["lockId"], "holdingContract": getLock["holdingContract"], "amount": getLock["amount"], "getLock": [getLock], "lockerAddress": [lockerAddress[network]] }];
        } else {
            lockerDataByWallet = [{ "data": ["data"], "token": ["token"], "getLock": [undefined] }];
        };
        return lockerDataByWallet;
    } catch (e) {
        console.log(e);
        return [{ "data": ["data"], "token": ["token"], "getLock": [undefined] }];
    };
}

export const getLockedTokenDetails = async (tokenAddress, account, network) => {

    const rawData = await getRawData(account, network);
    let web3 = new Web3(provider[network]);

    let tokenLocked = BigInt(0);
    rawData.map(each => {
        if (each.token === tokenAddress && !each.isWithdrawn) tokenLocked = tokenLocked + BigInt(each.amount);
    });
    // console.log(rawData)
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
    let symbol = await tokenContract.methods.symbol().call();
    let decimals = await tokenContract.methods.decimals().call();
    let totalSupply = await tokenContract.methods.totalSupply().call();
    let liquidityLocked = BigInt(0);
    let tokenLockHistory = [];

    const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
    let contractCallContext = rawData.map((each, index) => {
        return {
            reference: index,
            contractAddress: each.token,
            abi: erc20Abi,
            calls: [{ reference: 'symbolsCall', methodName: 'symbol' }]
        }
    })
    let response = await multicall.call(contractCallContext);
    let symbols = [];
    for (const [key, value] of Object.entries(response.results)) {
        symbols.push(value.callsReturnContext[0].returnValues[0]);
    }
    // console.log(rawData)
    for (let i = 0; i < rawData.length; i++) {
        let each = rawData[i];
        let address = each.token;
        let ownerAddress = each.owner;
        let tokenAmount = each.amount;
        let timestamp = each.timestamp;
        let isWithdrawn = each.isWithdrawn;
        //default token
        if (address.toLowerCase() === tokenAddress.toLowerCase()) tokenLockHistory.push({ id: each.id, address: address, owner: ownerAddress, tokenAmount: tokenAmount, timestamp: timestamp, isWithdrawn: isWithdrawn });
        //pool token
        else if (symbols[i] === 'HUL') {
            let poolContract = new web3.eth.Contract(liquidityPoolAbi, each.token);
            let token0 = await poolContract.methods.token0().call();
            let token1 = await poolContract.methods.token1().call();
            if (token0.toLowerCase() === tokenAddress.toLowerCase() || token1.toLowerCase() === tokenAddress.toLowerCase()) {
                let totalSupply = await poolContract.methods.totalSupply().call();
                let baseTokenTotalAmount = await tokenContract.methods.balanceOf(address).call();
                let baseTokenAmount = BigInt(baseTokenTotalAmount) * BigInt(tokenAmount) / BigInt(totalSupply);
                if (!each.isWithdrawn) liquidityLocked = liquidityLocked + baseTokenAmount;
                tokenLockHistory.push({ id: each.id, isPool: true, address: address, owner: ownerAddress, tokenAmount: tokenAmount, baseTokenAmount: baseTokenAmount.toString(), timestamp: timestamp, isWithdrawn: isWithdrawn });
            }
        }
    }
    // let tokenSymbol = await tokenContract.methods.symbol().call();
    // let tokenDecimals = await tokenContract.methods.decimals().call();
    // let tokenLocked = await tokenContract.methods.balanceOf(lockerAddress).call();
    // let tokenTotalSupply = await tokenContract.methods.totalSupply().call();

    let lockerContract = new web3.eth.Contract(lockerContractAbi, lockerAddress[network]);
    let depositEvents = await lockerContract.getPastEvents("LogLocking", {
        fromBlock: 0
    })
    let withdrawEvents = await lockerContract.getPastEvents("LogWithdrawal", {
        fromBlock: 0
    })

    // let tokenTransferEvents = await tokenContract.getPastEvents("Transfer",{
    //     fromBlock: 0,
    //     toBlock: "latest",
    //     filter: {
    //         to: lockerAddress
    //     }
    // })
    // let tokenTransferTransactions = await Promise.all(tokenTransferEvents.map(each => web3.eth.getTransaction(each.transactionHash)))
    // tokenTransferTransactions = tokenTransferTransactions.filter(each => each.input.length === 266);


    for (let i = 0; i < depositEvents.length; i++) {
        let blockDetail = await web3.eth.getBlock(depositEvents[i].blockNumber);
        depositEvents[i].timestamp = blockDetail.timestamp;
    }
    for (let i = 0; i < withdrawEvents.length; i++) {
        let blockDetail = await web3.eth.getBlock(withdrawEvents[i].blockNumber);
        withdrawEvents[i].timestamp = blockDetail.timestamp;
    }
    let events = [],
        j = 0;
    for (let i = 0; i < depositEvents.length; i++) {
        if (withdrawEvents[j] && withdrawEvents[j].returnValues.index === depositEvents[i].returnValues.index) {
            events.push({ deposit: depositEvents[i], withdraw: withdrawEvents[j] });
            j++;
        } else {
            events.push({ deposit: depositEvents[i] });
        }
    }

    return {
        address: tokenAddress,
        symbol: symbol,
        decimals: decimals,
        totalSupply: totalSupply,
        liquidityLocked: liquidityLocked,
        tokenLocked: tokenLocked,
        history: tokenLockHistory,
        events: events
    }
}

export const checkWalletAddress = (walletAddress, network) => {
    let web3 = new Web3(provider[network]);
    return web3.utils.isAddress(walletAddress);
}

export const getLastDeployedContract = async (account, network) => {
    let lastDeployedAddress;
    try {
        const response = await axios.get(`${serverApi}/vesting/lastDeployed/${network}/${account}`);
        lastDeployedAddress = response.data;
    } catch (e) {
        console.log(e);
    };
    return lastDeployedAddress;
}

export const deployContract = async (provider, account, token, network) => {
    const web3 = new Web3(provider);
    const abi = [{ "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "createTokenLocker", "outputs": [{ "internalType": "address", "name": "locker", "type": "address" }], "stateMutability": "payable", "type": "function" }]
    const contract = new web3.eth.Contract(abi, swapTokenLockerFactory[network]);
    let result = contract.methods.createTokenLocker(token).send({
        from: account
    })
    return result;
}

export const sendTokenVesting = async (provider, deployedContract, csvData, token, account, network) => {
    let _users = [],
        _amounts = [],
        _lockHours = [],
        _sendAmount = BigInt(0);
    const web3 = new Web3(provider);
    let abi = [{ "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }];
    let contract = new web3.eth.Contract(abi, token);
    let decimals = await contract.methods.decimals().call();
    csvData.map(each => {
        _users.push(each.address);
        _amounts.push(BigInt(each.amount * Math.pow(10, decimals)).toString());
        switch (each.period[each.period.length - 1]) {
            case 'M':
                _lockHours.push(each.period.slice(0, each.period.length - 1) * 30 * 24);
                break;
            case 'W':
                _lockHours.push(each.period.slice(0, each.period.length - 1) * 7 * 24);
                break;
            case 'D':
                _lockHours.push(each.period.slice(0, each.period.length - 1) * 24);
                break;
            case 'h':
                _lockHours.push(each.period.slice(0, each.period.length - 1));

        }
        _sendAmount += BigInt(each.amount * Math.pow(10, decimals));
    })
    _sendAmount = _sendAmount.toString();
    abi = [{ "inputs": [{ "internalType": "address[]", "name": "_users", "type": "address[]" }, { "internalType": "uint128[]", "name": "_amounts", "type": "uint128[]" }, { "internalType": "uint32[]", "name": "_lockHours", "type": "uint32[]" }, { "internalType": "uint256", "name": "_sendAmount", "type": "uint256" }], "name": "sendLockTokenMany", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "feesInETH", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

    contract = new web3.eth.Contract(abi, deployedContract)
    let feesInETH = await contract.methods.feesInETH().call();
    console.log(_users, _amounts, _lockHours, _sendAmount, account)
    let result = await contract.methods.sendLockTokenMany(_users, _amounts, _lockHours, _sendAmount).send({
        from: account,
        value: network !== "Avalanche" || network === "Avalanche" || network === "Avalanche_testnet" ? BigInt(feesInETH * Math.pow(10, 18)).toString() : feesInETH
    });
    return result;
}

export const getClaimTokenList = async (address, network) => {
    const web3 = new Web3(provider[network]);
    let factoryContract, abi, erc20Abi, allContracts, response, multicall, contractCallContext;
    abi = [{ "inputs": [], "name": "getAllContracts", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }];
    factoryContract = new web3.eth.Contract(abi, swapTokenLockerFactory[network]);
    allContracts = await factoryContract.methods.getAllContracts().call();
    console.log(allContracts)
    multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
    abi = [{ "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "getLockData", "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }, { "internalType": "uint128", "name": "", "type": "uint128" }, { "internalType": "uint64", "name": "", "type": "uint64" }, { "internalType": "uint64", "name": "", "type": "uint64" }, { "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getToken", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
    erc20Abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }]
    contractCallContext = allContracts.map((each, index) => {
        return {
            reference: index,
            contractAddress: each,
            abi: abi,
            calls: [
                { reference: 'getLockDataCall', methodName: 'getLockData', methodParameters: [address] },
                { reference: 'getTokenCall', methodName: 'getToken' }
            ]
        }
    })
    response = await multicall.call(contractCallContext);
    let returnData = [];
    contractCallContext = [];
    for (const [key, value] of Object.entries(response.results)) {
        let amount = BigInt(value.callsReturnContext[0].returnValues[0].hex).toString();
        let claimedAmount = BigInt(value.callsReturnContext[0].returnValues[1].hex).toString();
        let lockTimestamp = BigInt(value.callsReturnContext[0].returnValues[2].hex).toString();
        let lastUpdated = BigInt(value.callsReturnContext[0].returnValues[3].hex).toString();
        let lockHours = value.callsReturnContext[0].returnValues[4];
        let contract = allContracts[key];
        let token = value.callsReturnContext[1].returnValues[0];
        if (amount !== '0') {
            contractCallContext.push({
                reference: returnData.length,
                contractAddress: token,
                abi: erc20Abi,
                calls: [
                    { reference: 'nameCall', methodName: 'name' },
                    { reference: 'decimalsCall', methodName: 'decimals' },
                    { reference: 'symbolCall', methodName: 'symbol' }
                ]
            })
            returnData.push({
                amount: amount,
                claimedAmount: claimedAmount,
                lockTimestamp: lockTimestamp,
                lastUpdated: lastUpdated,
                lockHours: lockHours,
                contract: contract,
                token: {
                    address: token
                }
            })
        }
    }

    response = await multicall.call(contractCallContext);
    for (const [key, value] of Object.entries(response.results)) {
        let name = value.callsReturnContext[0].returnValues[0];
        let symbol = value.callsReturnContext[2].returnValues[0];
        let decimals = value.callsReturnContext[1].returnValues[0];
        returnData[key].token.name = name;
        returnData[key].token.symbol = symbol;
        returnData[key].token.decimals = decimals;
    }
    return returnData;
}

export const claimToken = async (provider, tokenDetail, account) => {
    let currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - tokenDetail.lastUpdated < 3600) return { state: false, reason: 'Wait to next claim available' };
    const passedHours = Math.floor((currentTimestamp - tokenDetail.lockTimestamp) / 3600);
    let availableAmount = BigInt(Math.floor(tokenDetail.amount * passedHours / tokenDetail.lockHours) - tokenDetail.claimedAmount).toString();
    if (Number(availableAmount) > maxTxLimit) availableAmount = maxTxLimit.toString();
    const web3 = new Web3(provider);
    const abi = [{ "inputs": [{ "internalType": "uint128", "name": "_amount", "type": "uint128" }], "name": "claimToken", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }]
    const contract = new web3.eth.Contract(abi, tokenDetail.contract);
    const response = await contract.methods.claimToken(availableAmount).send({
        from: account
    });
    console.log(response);
}

export const airdrop = async (provider, csvData, token, account, network) => {
    let _users = [],
        _amounts = [];
    const web3 = new Web3(provider);
    let abi = [{ "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }];
    // console.log(token)
    let contract = new web3.eth.Contract(abi, token);
    let decimals = await contract.methods.decimals().call();
    csvData.map(each => {
        _users.push(web3.utils.toChecksumAddress(each.address));
        _amounts.push(BigInt(each.amount * Math.pow(10, decimals)).toString());
    })
    // console.log(_users)
    // console.log(_amounts)
    abi = [{ "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "address[]", "name": "_users", "type": "address[]" }, { "internalType": "uint128[]", "name": "_amounts", "type": "uint128[]" }], "name": "airdrop", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "companyWallet", "outputs": [{ "internalType": "addresspayable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feesInETH", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    contract = new web3.eth.Contract(abi, airdropAddress[network]);
    let feeInETH = await contract.methods.feesInETH().call();
    let result = await contract.methods.airdrop(token, _users, _amounts).send({
        from: account,
        value: network === "Avalanche" || network === "Avalanche_testnet" ? BigInt(feeInETH * Math.pow(10, 18)).toString() : feeInETH
    });
    return result;
}