const IPFS_UPLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/add?pin=true'
const IPFS_DOWNLOAD_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat'

export const uploadToIPFS = async (data: string | Blob) => {
  if (!data) {
    throw new Error('Data is null')
  }

  const form = new FormData()
  form.append('file', data)

  // refer to https://infura.io/docs/ipfs#section/Getting-Started/Add-a-file
  const response = await fetch(IPFS_UPLOAD_ENDPOINT as string, {
    method: 'POST',
    body: form,
  })

  const responseBody = await response.json()
  return { hash: responseBody.Hash as string }
}

export const getFromIPFS = async (hash: string) => {
  const response = await fetch(`${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`)
  if (response.ok) return await response.text()
  console.error(response.statusText)

  // fallback
  const fallbackResponse = await fetch(`https://ipfs.io/ipfs/${hash}`)
  if (fallbackResponse.ok) return await fallbackResponse.text()
  console.error(fallbackResponse.statusText)
  return ''
}

export const getUrlForIPFSHash = (hash: string) => {
  // https://docs.ipfs.io/concepts/what-is-ipfs
  // https://infura.io/docs/ipfs#section/Getting-Started/Pin-a-file
  if (hash === '') {
    return ''
  }

  return `${IPFS_DOWNLOAD_ENDPOINT}?arg=${hash}`
}

export const isIpfsHash = (str: string | undefined | null) =>
  !!str && str.startsWith('Qm') && str.length < 256
