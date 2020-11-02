import axios from 'axios'
const baseUrl = '/api/notes'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    id: 1000,
    content: 'This note is not saved to server',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  }
  return request.then(res => res.data.concat(nonExisting))
}

const create = async newObj => {
  const config = {
    headers: { Authorization: token },
  }
    const response = await axios.post(baseUrl, newObj, config)
    return response.data
}

const update = (id , newObj) => {
    const request = axios.put(`${baseUrl}/${id}`, newObj)
    return request.then(res => res.data)
}

export default {getAll, create, update, setToken }