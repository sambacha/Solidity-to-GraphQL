const { genGraphQlProperties } = require('./lib/index')
const { deploy, mainAccount, web3 } = require('./aion')
const { ApolloServer } = require('apollo-server')
const path = require('path')
const fs = require('fs')
const ExampleContract = fs.readFileSync(
  path.resolve(__dirname, 'contracts', 'Example.sol'),
  'utf8'
)
const deployContract = async () => {
  // TIP:  you can use compiled ABI and pre deployed contract address to save deployment time.

  // const deployedContract = {
  //   address:
  //     '0xa062187f6f42d4cb9da6c8644b9647daef571c2aecc031490955bfc897f23436',
  //   abi: [
  //     {
  //       outputs: [
  //         {
  //           name: '',
  //           type: 'uint128'
  //         }
  //       ],
  //       constant: false,
  //       payable: false,
  //       inputs: [
  //         {
  //           name: 'a',
  //           type: 'uint128'
  //         }
  //       ],
  //       name: 'add',
  //       type: 'function'
  //     },
  //     {
  //       outputs: [
  //         {
  //           name: '',
  //           type: 'uint128'
  //         }
  //       ],
  //       constant: true,
  //       payable: false,
  //       inputs: [],
  //       name: 'num',
  //       type: 'function'
  //     },
  //     {
  //       outputs: [],
  //       constant: false,
  //       payable: false,
  //       inputs: [
  //         {
  //           name: 'a',
  //           type: 'uint128'
  //         }
  //       ],
  //       name: 'setA',
  //       type: 'function'
  //     }
  //   ]
  // }

  const { deployedContract } = await deploy(ExampleContract, 'Example', '')
  return deployedContract
}

const startServer = async () => {
  try {
    console.log('Deploying...')
    const { abi, address } = await deployContract()
    console.log('deployed at ' + address)
    global.mainAccount = mainAccount
    const { schema, rootValue } = await genGraphQlProperties({
      artifact: {
        abi
      },
      contract: web3.eth.contract(abi).at(address)
    })
    const server = new ApolloServer({ schema, rootValue })
    server.listen({ port: 5001 }).then(({ url }) => {
      console.log(`GQL Playground ready at ${url}`)
    })
  } catch (err) {
    console.error(err)
  }
}
startServer()
