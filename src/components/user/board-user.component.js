import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from "../../services/user.service";

export default class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      message: null
    }
    this.reloadUserList = this.reloadUserList.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount() {
    this.reloadUserList();
  
  }

  reloadUserList() {
    UserService.getAllUsers()
        .then(
            response => {
                console.log(response);
                this.setState({ users: response.data })
            }
        )
  }

  deleteUser(id) {
    UserService.deleteUser(id)
        .then(
            response => {
                this.setState({ message: `Delete of User ${id} Successful` })
                this.reloadUserList()
            }
        )

  }

  editUser(id) {
    window.localStorage.setItem("userId", id);
    this.props.history.push('/edit-user');
  }

  addUser() {
    window.localStorage.removeItem("userId");
    this.props.history.push('/register');
  }

  render() {
    return (
      <div className="container">
                <h3>All Users</h3>
                {this.state.message && <div class="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.users.map(
                                    user =>
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.roles.map(role => role.name+" ")}</td>
                                            <td><Button variant="warning" onClick={() => this.editUser(user.id)}>Update</Button></td>
                                            <td><Button variant="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button></td>
                                        </tr>
                                )
                            }
                        </tbody>                           
                    </table>
                </div>
                <button className="btn btn-success" onClick={() => this.addUser()}>Add</button>
            </div>
    );
  }
}