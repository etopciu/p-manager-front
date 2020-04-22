import React, { Component } from "react";
import ProjectService from "../../services/project.service";
import UserService from "../../services/user.service";
import TaskService from "../../services/task.service";
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';


export default class AddProject extends Component {
  
        constructor(props){
            super(props);
            this.state ={
                title: '',
                description: '',
                users: [],
                userList: [],
                message:'', 
                successful: false

            }
            this.saveProject = this.saveProject.bind(this);
            this.getUsers = this.getUsers.bind(this);
        }
    
        componentDidMount () {
            this.getUsers();
        }

        saveProject = (e) => {
            e.preventDefault();
            let project = {title: this.state.title, description: this.state.description, users: this.state.users};
            ProjectService.addProject(project)
                .then(res => {
                    this.setState({message : 'Project added successfully.'});
                    this.setState ({successful: true});
                    this.props.history.push('/projects');
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
            UserService.getAllUsers()
                .then(
                    response => {
                        this.setState({userList: response.data})
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
                    <h3 className="text-center">Add Project</h3>
                    <form>
                    <div className="form-group">
                        <label>Project Title:</label>
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
                                <MultiSelect
                                    data={this.state.userList}
                                    onChange={this.handleUserChange}
                                    value={this.state.users}
                                    textField="username"
                                    dataItemKey="id"
                                />
                        </div>
                    </div>

                    <button className="btn btn-success" onClick={this.saveProject}>Save</button>
                </form>
        </div>
            );
        }
    }
    
