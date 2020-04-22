import React, { Component } from "react";
import TaskService from "../../services/task.service";
import UserService from "../../services/user.service";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';
import projectService from "../../services/project.service";


export default class AddTask extends Component {
  
        constructor(props){
            super(props);
            this.state ={
                title: '',
                description: '',
                users:[],
                userId:[],
                status: "",
                created_date:"",
                start_date:"",
                end_date:"",
                userList: [],
                projectId:[],
                message:'', 
                successful: false
            }
            this.saveTask = this.saveTask.bind(this);
            this.getUsers = this.getUsers.bind(this);
        }
    
        componentDidMount () {
            this.getUsers()
        }

        saveTask = (e) => {
            e.preventDefault();
            let task = {title: this.state.title, description: this.state.description};
            console.log(this.state.users.id)
            TaskService.addTask(window.localStorage.getItem("projectId"),this.state.users.id,task)
                .then(res => {
                    this.setState({message : 'Task added successfully.'});
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

        getUsers(){
            projectService.getProject(window.localStorage.getItem("projectId"))
                .then(
                    response => {
                        this.setState({userList: response.data.users})
                    }
                )
        }

        onChange = (e) =>
            this.setState({ [e.target.name]: e.target.value });
       
        handleUserChange = (e) => {
                this.setState({
                    users: e.target.value
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
                    <h3 className="text-center">Add Task</h3>
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
                                Assign Users: 
                            </div>
                                <DropDownList
                                    data={this.state.userList}
                                    onChange={this.handleUserChange}
                                    value={this.state.usersList}
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
    
