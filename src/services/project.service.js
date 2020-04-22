import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/projects/';

class ProjectService {
  getProjects() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getProjectsByUserId(id) {
    return axios.get(API_URL+'user/'+id, { headers: authHeader() });
  }

  getProject(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  editProject(project) {
    return axios.put(API_URL, project, { headers: authHeader() });
  }

  addProject(project){
      return axios.post(API_URL, project, { headers: authHeader() });
  }

  deleteProject(id){
      return axios.delete (API_URL + id, { headers: authHeader() })
  }

}

export default new ProjectService();