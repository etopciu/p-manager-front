import React, { Component } from "react";

import ProjectService from "../../services/project.service";
import AuthService from "../../services/auth.service"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      currentUser:[],
      isAdmin:false,
      message: null
    }
    this.reloadProjectList = this.reloadProjectList.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.editProject = this.editProject.bind(this);
    this.addProject = this.addProject.bind(this);
  }

  componentDidMount() {
    this.state.currentUser = AuthService.getCurrentUser();
    this.state.isAdmin =  this.state.currentUser.roles.includes("ROLE_ADMIN");
    this.reloadProjectList();
  }

  reloadProjectList() {

      this.state.isAdmin ? (
      ProjectService.getProjects()
      .then(
          response => {
              console.log(response);
              this.setState({ projects: response.data })
          }
      )
    ) :
    (
      ProjectService.getProjectsByUserId(this.state.currentUser.id)
      .then(
          response => {
              console.log(response);
              this.setState({ projects: response.data })
          }
      )
    )
   
  }

  deleteProject(id) {
    ProjectService.deleteProject(id)
        .then(
            response => {
                this.setState({ message: `Delete of Project ${id} Successful` })
                this.reloadProjectList()
            }
        )

  }

  editProject(id) {
    window.localStorage.setItem("projectId", id);
    this.props.history.push('/edit-project');
  }

  getTasks(id) {
    window.localStorage.setItem("projectId", id);
    this.props.history.push('/tasks');
  }

  addProject() {
    window.localStorage.removeItem("projectId");
    this.props.history.push('/add-project');
  }

  render() {
    return (
      <div className="container">
                <h3>All Projects</h3>
                {this.state.message && <div class="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.projects.map(
                                    project =>
                                        <tr key={project.id}>
                                            <td>{project.id}</td>
                                            <td>{project.title}</td>
                                            <td>{project.description}</td>
                                            {
                                              this.state.isAdmin && <td><Button variant="warning" onClick={() => this.editProject(project.id)}>Update</Button></td>
                                            }
                                            <td><Button variant="info" onClick={() => this.getTasks(project.id)}>Tasks</Button></td>
                                            {
                                              this.state.isAdmin && <td><Button variant="danger" onClick={() => this.deleteProject(project.id)}>Delete</Button></td>
                                            }
                                            
                                        </tr>
                                )
                            }
                        </tbody>                           
                    </table>
                </div>
                {
                  this.state.isAdmin && <Button variant="success" onClick={() => this.addProject()}>Add</Button>
                }
            </div>
    );
  }
}
