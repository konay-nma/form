import axios from 'axios'
const baseUrl = '/api/notes'

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

const create = newObj => {
    const request = axios.post(baseUrl, newObj)
    return request.then(res => res.data)
}

const update = (id , newObj) => {
    const request = axios.put(`${baseUrl}/${id}`, newObj)
    return request.then(res => res.data)
}

export default {getAll, create, update}