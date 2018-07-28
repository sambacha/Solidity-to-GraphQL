const { mainAccountPass, web3Address } = require('./config')
const Web3 = require('aion-web3')
const web3 = new Web3(new Web3.providers.HttpProvider(web3Address))
const mainAccount = web3.personal.listAccounts[0]
const compile = async (sol) => {
  return new Promise((resolve, reject) => {
    web3.eth.compile.solidity(sol, (err, res) => {
      if (err) {
        console.log('compile error:' + err)
        reject(err)
      }
      if (res) {
        // console.log('compile res:' + JSON.stringify(res))
        resolve(res)
      }
    })
  })
}

const unlock = async (addr, pw) => {
  return new Promise((resolve, reject) => {
    web3.personal.unlockAccount(addr, pw, 999999, (err, unlock) => {
      if (err) reject(err)
      else if (unlock && unlock === true) {
        resolve(addr)
      } else {
        reject('unlock fail')
      }
    })
  })
}

const _deployContract = async (acc0, abi, code, args) => {
  return new Promise((resolve, reject) => {
    if (args.length > 0) {
      console.dir(args.split(','))
      web3.eth.contract(abi).new(
        ...args.split(','),
        {
          from: acc0,
          data: code,
          gas: 4700000
        },
        (err, contract) => {
          if (err) {
            console.log('rejecting...')
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    } else {
      web3.eth.contract(abi).new(
        {
          from: acc0,
          data: code,
          gas: 4700000
        },
        (err, contract) => {
          if (err) {
            console.log('rejecting...')
            reject(err)
          } else if (contract && contract.address) {
            resolve(contract)
          }
        }
      )
    }
  })
}

const deploy = async (sol, name, args) => {
  const compiledCode = await compile(sol)
  await unlock(mainAccount, mainAccountPass)
  const deployedContract = await _deployContract(
    mainAccount,
    compiledCode[name].info.abiDefinition,
    compiledCode[name].code,
    args
  )
  return {
    deployedContract,
    compiledCode
  }
}

module.exports = {
  unlock,
  compile,
  deploy,
  mainAccount,
  web3
}
