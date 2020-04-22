import React, { Component } from "react";

import TaskService from "../../services/task.service";
import ProjectService from "../../services/project.service";
import { MultiSelect, DropDownList } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';
import userService from "../../services/user.service";

export default class EditTask extends Component {
  
        constructor(props){
            super(props);
            this.state ={
                id:[],
                title: '',
                description: '',
                user: [],
                status: "",
                created_date:"",
                start_date:"",
                end_date:"",
                userList: [],
                statuses:['PENDING','ONGOING','COMPLETED'],
                message:'', 
                successful: false
            }
            this.saveTask = this.saveTask.bind(this);
            this.getUsers = this.getUsers.bind(this);
            this.getUserByTaskId = this.getUserByTaskId.bind(this);

        }

        componentDidMount() {
            TaskService.getTaskByIdAndProjectId(window.localStorage.getItem("taskId"),window.localStorage.getItem("projectId"))
            .then(
                response => {
                    this.setState({
                            id:response.data.id,
                            title:response.data.title,
                        	description: response.data.description,
                            status:response.data.status,
                            created_date:response.data.createdDate,
                            start_date:response.data.startDate,
                            end_date:response.data.endDate
                         })
                }
            );
            this.getUsers();
            this.getUserByTaskId(window.localStorage.getItem("taskId"));
          }

          getUsers(){
            ProjectService.getProject(window.localStorage.getItem("projectId"))
            .then(
                response => {
                    this.setState({userList: response.data.users})
                }
            )
        }

        getUserByTaskId(taskId){
            userService.getUserByTaskId(taskId)
            .then(
                response => {
                    this.setState({user: response.data})
                }
            )
        }
    
        saveTask = (e) => {
            e.preventDefault();
            let task = {id: this.state.id, title: this.state.title, description: this.state.description, status:this.state.status,createdDate:this.state.created_date,startDate:this.state.start_date,endDate:this.state.end_date};
            TaskService.editTask(window.localStorage.getItem("projectId"),this.state.user.id,task)
                .then(res => {
                    this.setState({message : 'Task updated successfully.'});
                    this.props.history.push('/tasks');
                },
                error => {
                const resMessage =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString();
    
                this.setState({
                    message: resMessage,
                    successful: false
                });
            });
        }

        onChange = (e) =>
            this.setState({ [e.target.name]: e.target.value });

        handleUserChange = (e) => {
                this.setState({
                    user: e.target.value
                });
            }
        
        handleStatusChange = (e) => {
                this.setState({
                    status : e.target.value
                });
            }
    
        render() {
            return(
                <div>
                    {this.state.message && (
                        <div className="form-group">
                            <div
                            className={
                                this.state.successful
                                ? "alert alert-success"
                                : "alert alert-danger"
                            }
                            role="alert"
                            >
                            {this.state.message}
                            </div>
                        </div>
                     )}
                    <h3 className="text-center">Edit Task</h3>
                    <form>
                    <div className="form-group">
                        <label>Task Title:</label>
                        <input type="text" placeholder="title" name="title" className="form-control" value={this.state.title} onChange={this.onChange}/>
                    </div>
    
                    <div className="form-group">
                        <label>Description:</label>
                        <input type="text" placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange}/>
                    </div>

                    <div className="form-group">
                       <div>
                            <div className="example-config">
                                Assign User: 
                            </div>
                                <DropDownList
                                    data={this.state.userList}
                                    onChange={this.handleUserChange}
                                    value={this.state.user}
                                    textField="username"
                                    dataItemKey="id"
                                />
                        </div>
                    </div>

                    <button className="btn btn-success" onClick={this.saveTask}>Save</button>
                </form>
        </div>
            );
        }
    }
    
