# AION ABI to GraphQL Scheme

This will consume an ABI object created when deploying a Solidity Smart contract, and return a graphql schema and resolver. This object can be plugged into a the graphql server of your choice.

# Usage:

Install the package with npm or yarn.

npm install aion-to-graphql
yarn add aion-to-graphql

Once installed, you have to create your own graphql server. This means you pass in the Abi and contract instance.
Example:
`{ artifact: abi, contract: web3.eth.contract(abi).at(address) }`

This package will return the schema and rootValue that you can pass into your GraphQL server.

```
## Base Types

We have two base types that help us convert some AION int/uint and Bytes into graphQL schema types. The first is for ints/uints. Whenever a function returns these types, you will have the option of returning either the string and/or int type.
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
When a function returns a bytes, you can choose to return the raw data or the decoded data if desired.


## Return Type Templates

Because we are auto generating the Schema, we have to define some standard conversions. We have two templates for accessing the return values from solidity:

1. Single: `${typeName}_${IndexOfReturn}`
2. Arrays: `${typeName}Arr_${IndexOfReturn}`

If you return an address as the third return value you would use: `address_2`. If you return a uint in the fourth value you would use `uint256_3`. If you return an array of bytes as the first return you would use `bytes32Arr_0`.


## Writing Queries

To write a query, you must use the function name as the base, pass any variables if any, and then the type name with an index (`${typeName}_${IndexOfOutput}`)

## Learn More

Checkout the examples in file `aion-server.js` and `test/aion.test.js`.
These examples demonstrates how to interact with a basic set and get Smart contract using GQL queries and mutations.
```

## Important Note :

This repository is forked from [Ethereum-to-GraphQ](https://github.com/hellosugoi/Ethereum-to-GraphQL/) by Angello Pozo.
