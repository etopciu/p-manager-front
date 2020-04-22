import React, { Component } from "react";
import TaskService from "../../services/task.service";
import AuthService from "../../services/auth.service";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import userService from "../../services/user.service";
import Moment from 'react-moment';

export default class TaskList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tasks: [],
      currentUser:[],
      user:'',
      isAdmin:false,
      message: null
    }
    this.reloadTaskList = this.reloadTaskList.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.startTask = this.startTask.bind(this);
    this.finishTask = this.finishTask.bind(this);
    // this.getUserByTaskId = this.getUserByTaskId.bind(this);


  }

  componentDidMount() {
    this.state.currentUser = AuthService.getCurrentUser();
    this.state.isAdmin =  this.state.currentUser.roles.includes("ROLE_ADMIN");
    this.reloadTaskList();
  
  }

  reloadTaskList() {
    this.state.isAdmin ? (
    TaskService.getTasksByProject(window.localStorage.getItem("projectId"))
        .then(
            response => {
                console.log(response);
                this.setState({ tasks: response.data})
            }
        )
    ) :
    (
      TaskService.getTasksByUserIdAndProjectId(this.state.currentUser.id,window.localStorage.getItem("projectId"))
        .then(
            response => {
                console.log(response);
                this.setState({ tasks: response.data})
            }
        )
    )
  }

  deleteTask(id) {
    TaskService.deleteTask(id)
        .then(
            response => {
                this.setState({ message: `Delete of Task ${id} Successful` })
                this.reloadTaskList()
            }
        )

  }

  startTask(id) {
    TaskService.startTask(id)
        .then(
            response => {
                this.setState({ message: `Start of Task ${id} Successful` })
                this.reloadTaskList()
            }
        )

  }

  finishTask(id) {
    TaskService.finishTask(id)
        .then(
            response => {
                this.setState({ message: `Finish of Task ${id} Successful` })
                this.reloadTaskList()
            }
        )

  }

  editTask(id) {
    window.localStorage.setItem("taskId", id);
    this.props.history.push('/edit-task');
  }

  addTask() {
    window.localStorage.removeItem("taskId");
    this.props.history.push('/add-task');
  }

  // getUserByTaskId(taskId){
  //   userService.getUserByTaskId(taskId)
  //     .then(
  //       response => {
  //         return response.data.username
  //       }
  //   )
  // }

  switchState(task) {
    switch (task.status) {
      case "PENDING":
        return <Button variant="info"  onClick={() => this.startTask(task.id)}>Start</Button>
      case "ONGOING":
          return <Button variant="info"  onClick={() => this.finishTask(task.id)}>Finish</Button>
      default:
        break;
    }
  }

  render() {
    return (
      <div className="container">
                <h3>All Tasks</h3>
                {this.state.message && <div class="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>State</th>
                                {
                                  this.state.isAdmin &&<th>User</th>
                                }
                                <th>Start</th>
                                <th>End</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                             this.state.tasks.map(
                              task =>
                                  <tr key={task.id}>
                                      <td>{task.id}</td>
                                      <td>{task.title}</td>
                                      <td>{task.description}</td>
                                      <td>{task.status}</td>
                                      {
                                       this.state.isAdmin &&<td>{task.username}</td>
                                      }
                                      <td>{
                                        task.startDate &&  <Moment format="YYYY-MM-DD HH:mm" >{task.startDate}</Moment>
                                      }</td>
                                      <td> {
                                        task.endDate && <Moment format="YYYY-MM-DD HH:mm" >{task.endDate}</Moment>
                                      }</td>
                                      <td>{this.switchState(task)}</td>
                                      {
                                        this.state.isAdmin && <td><Button variant="warning" onClick={() => this.editTask(task.id)}>Update</Button></td>
                                      }
                                      {
                                        this.state.isAdmin && <td><Button variant="danger" onClick={() => this.deleteTask(task.id)}>Delete</Button></td>
                                      }
                                      
                                  </tr>
                            )
                            }
                        </tbody>                           
                    </table>
                </div>
                {
                   this.state.isAdmin && <Button variant="success" onClick={() => this.addTask()}>Add</Button>
                }
            </div>
    );
  }
}
