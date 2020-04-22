import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/tasks/';

class TaskService {
  getTasks() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getTasksByProject(projectId) {
    return axios.get(API_URL+'project/'+projectId, { headers: authHeader() });
  }

  getTasksByUserIdAndProjectId(userId,projectId) {
    return axios.get(API_URL+'user/'+userId+'/project/'+projectId, { headers: authHeader() });
  }

  getTaskByIdAndProjectId(id,projectId) {
    return axios.get(API_URL+"project/"+projectId+"/task/"+id, { headers: authHeader() });
  }

  editTask(projectId,userId,task) {
    return axios.put(API_URL+projectId+"/"+userId, task, { headers: authHeader() });
  }
  
  addTask(projectId,userId,task){
      return axios.post(API_URL+projectId+"/"+userId, task, { headers: authHeader() });
  }

  deleteTask(id){
      return axios.delete (API_URL + id, { headers: authHeader() });
  }

  startTask(id){
    return axios.put (API_URL +'start/'+ id,null, { headers: authHeader() });
  }

  finishTask(id){
    return axios.put (API_URL +'finish/'+ id,null, { headers: authHeader() });
  }

}

export default new TaskService();