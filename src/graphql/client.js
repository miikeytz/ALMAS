const ENDPOINT = 'http://127.0.0.1:8000/graphql'

export async function graphqlRequest(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()

  if (json.errors) {
    console.error(json.errors)
    throw new Error(json.errors[0].message)
  }

  return json.data
}