import React, { Component } from "react";

import UserService from "../../services/user.service";

export default class EditUser extends Component {
  
        constructor(props){
            super(props);
            this.state ={
                id:[],
                username: '',
                email: '',
                password:'',
                roles:[]
            }
            this.saveUser = this.saveUser.bind(this);
        }

        componentDidMount() {
            UserService.getUserById(window.localStorage.getItem("userId"))
            .then(
                response => {
                    this.setState({
                            id:response.data.id,
                            username:response.data.username,
                            email:response.data.email,
                            password:response.data.password,
                        	roles:response.data.roles,
                            })
                }
            )
          }
    
        saveUser = (e) => {
            e.preventDefault();
            let user = {id: this.state.id, username: this.state.username, email: this.state.email, password: this.state.password, roles: this.state.roles};
            UserService.editUser(user)
                .then(res => {
                    this.setState({message : 'User updated successfully.'});
                    this.props.history.push('/users');
                });
        }

        onChange = (e) =>
            this.setState({ [e.target.name]: e.target.value });
    
        render() {
            return(
                <div>
                    <h3 className="text-center">Edit User</h3>
                    <form>
                    <div className="form-group">
                        <label>Username :</label>
                        <input type="text" placeholder="username" name="username" className="form-control" value={this.state.username} onChange={this.onChange}/>
                    </div>
    
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text" placeholder="emai" name="description" className="form-control" value={this.state.email} onChange={this.onChange}/>
                    </div>


    
                    <button className="btn btn-success" onClick={this.saveUser}>Save</button>
                </form>
        </div>
            );
        }
    }
    