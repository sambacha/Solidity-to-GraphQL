# AION ABI to GraphQL Scheme

This will consume an ABI object created when deploying a Solidity Smart contract, and return a graphql schema and resolver. This object can be plugged into a the graphql server of your choice.

# Usage:

Install the package with npm or yarn.

npm install aion-to-graphql
yarn add aion-to-graphql

Once installed, you have to create your own graphql server. This means you pass in the Abi and contract instance.
Example:
`{ artifact: abi, contract: web3.eth.contract(abi).at(address) }`

This package will retrun the schema and rootValue that you can pass into your GraphQL server.

Checkout the example in file `aion-server.js` and `aion.test.js` under test folder.
These examples demonstrates how to interact with a basic set and get Smart contract using GQL queries and mutations.

```
## Base Types

We have two base types that help us convert some AION int/uint and Bytes into graphQL schema types. The first is for ints/uints. Whenver a function returns these types, you will have the option of returning either the string and/or int type.
```

type Value {
string: String
int: Int
}

```
The second base type are the bytes types.
```

type Bytes {
raw: String
decoded: String
}

```
When a function returns a bytes, you can chooose to return the raw data or the decoded data if desired.


## Return Type Templates

Because we are auto generating the Schema, we have to define some standard conversions. We have two templates for accessing the return values from solidity:

1. Single: `${typeName}_${IndexOfReturn}`
2. Arrays: `${typeName}Arr_${IndexOfReturn}`

If you return an address as the third return value you would use: `address_2`. If you return a uint in the fourth value you would use `uint256_3`. If you return an array of bytes as the first return you would use `bytes32Arr_0`.


## Writing Queries

To write a query, you must use the function name as the base, pass any variables if any, and then the type name with an index (`${typeName}_${IndexOfOutput}`)
```

// Solidity
function getBalanceInEth(address addr) public returns(uint) {
return ConvertLib.convert(getBalance(addr), 2);
}

// GraphQL Query
{
query {
getBalanceInEth(addr: "0x7b2c6c6e9026bcef8df4df3ff888b72b018f0e8a") {
uint256_0 {
string
int
}
}
}
}

// Result
{
'getBalanceInEth': {
'uint256_0': {
'string': '0',
'int': 0
}
}
}

```
Our `getBalanceInEth` function in solidity returns a uint (alias for uint256) as the first and only value. Therefore we  the `uint256_0` key name for that input. As described in our base types above, we can select the string or int types.


We also handle multiple returns and arrays. The additional type change for arrays is the addition of `Arr` to the query type template (`${typeName}Arr_${IndexOfOutput}`). For example, if you return an array of ints as the second return, the schema name is `uint256Arr_1`. A Larger example is below.
```

// Solidity
function returnsOnlyArrays() public view returns(int[], address[], bytes32[]) {
// ...removed
return (Arr1, Arr2, Arr3);
}

// GraphQL Query
{
query {
returnsOnlyArrays {
int256Arr_0 {
string
}
addressArr_1
bytes32Arr_2 {
decoded
raw
}
}
}
}

// Result
{
'returnsOnlyArrays': {
'int256Arr_0': [
{
'string': '2'
}, {
'string': '5'
}, {
'string': '8'
}
],
'addressArr_1': [
'0x0000000000000000000000000000000000000004',
'0x0000000000000000000000000000000000000007',
'0x0000000000000000000000000000000000000009'
],
'bytes32Arr_2': [
{
'decoded': 'uno',
'raw': '0x756e6f0000000000000000000000000000000000000000000000000000000000'
},
{
'decoded': 'dos',
'raw': '0x646f730000000000000000000000000000000000000000000000000000000000'
},
{
'decoded': 'tres',
'raw': '0x7472657300000000000000000000000000000000000000000000000000000000'
}
]
}
}

## Important Note :

This repository is forked from [Ethereum-to-GraphQ](https://github.com/hellosugoi/Ethereum-to-GraphQL/) by Angello Pozo.
