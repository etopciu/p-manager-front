import axios from 'axios';
import authHeader from './auth-header';
import 'bootstrap/dist/css/bootstrap.min.css';


const API_URL = 'http://localhost:8080/api/stats/';

class StatsService {
  getStats() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getStatsByProject(projectId) {
    return axios.get(API_URL+'project/'+projectId, { headers: authHeader() });
  }

}

export default new StatsService();