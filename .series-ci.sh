#!/bin/bash
curl \
  --header "Authorization: Token 53117ef1-1f86-4936-8190-bf11a37f51f3" \
  --header "Content-Type: application/json" \
  --data "{
    \"values\":[
      {
        \"line\":\"a\",
        \"value\":\"1 %\"
      },
      {
        \"line\":\"b\",
        \"value\":\"2 %\"
      },
      {
        \"line\":\"c\",
        \"value\":\"3 %\"
      }
    ],
    \"sha\":\"${TRAVIS_COMMIT}\"
  }" \
  https://seriesci.com/api/sambacha/Solidity-to-GraphQL/:series/many
