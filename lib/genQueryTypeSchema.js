 const genType = ({ typeName, typeBody }) => {
  return `
  type ${typeName} {
    ${typeBody}
  }`
}
const typesToSchemaLine = (data) => {
  return data.types
    .map((type) => `${type.name}: ${type.value}`)
    .reduce((out, cur, index) => {
      return index === 0 ? `${out} ${cur}` : `${out} \n     ${cur}`
    }, '')
}

const genOutputFuncitonMapper = (outputTypesDef) => {
  return (result) => {
    const resultsIsArr = Array.isArray(result)
    const outputTypesDefIsArray = Array.isArray(outputTypesDef)
    const combined = zipOutputWithResults(
      resultsIsArr,
      outputTypesDefIsArray,
      result,
      outputTypesDef
    )
    
const topString = `
  type Value {
    string: String
    int: Int
  }
  type Bytes {
    raw: String
    decoded: String
  }
  type Receipt {
    blockHash: String
    blockNumber: Int
    contractAddress: String
    cumulativeGasUsed: String
    cumulativeNrgUsed: Int
    from: String
    gasLimit:String    
    gasUsed: Int
    logs: String
    logsBloom: String
    nrgPrice:String
    nrgUsed:Int
    root: String
    status: String
    to: String
    transactionHash: String
    transactionIndex: Int
  }
  
  `

// Pupose of this method is to create the function that will receive data from Ethereum and return to graphQL for further processing
const genOutputFnMapper = ({ queryConverter }) => {
  return queryConverter
    .map((item) => {
      return {
        fnName: item.name,
        outputMapper: genOutputFuncitonMapper(item.types)
      }
    })
    .reduce((out, cur) => {
      out[cur.fnName] = cur.outputMapper
      return out
    }, {})
}

module.exports = {
  genOutputFnMapper
}

