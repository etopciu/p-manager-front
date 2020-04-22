import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/users/';


class UserService {
  getAllUsers() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getUserById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  getUserByTaskId(id) {
    return axios.get(API_URL +'tasks/'+ id, { headers: authHeader() });
  }

  editUser(user) {
    return axios.put(API_URL, user, { headers: authHeader() });
  }

  deleteUser(id){
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  getPublicContent(){
    return axios.get('http://localhost:8080/api/test/all',{ headers: authHeader() })
  }
}

export default new UserService();