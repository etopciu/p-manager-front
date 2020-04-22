import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";

import Login from "./components/user/login.component";
import Register from "./components/user/register.component";
import Home from "./components/home.component";
import Profile from "./components/user/profile.component";
import ProjectList from "./components/project/project-list.component";
import AddProject from "./components/project/add-project.component";
import EditProject from "./components/project/edit-project.component";
import ListUsers from "./components/user/board-user.component";
import EditUser from "./components/user/edit-user.component";
import TaskList from "./components/task/task-list.component";
import AddTask from "./components/task/add-task.component";
import EditTask from "./components/task/edit-task.component";
import Stats from "./components/stats.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: AuthService.getCurrentUser(),
        isAdmin: user.roles.includes("ROLE_ADMIN")
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, isAdmin } = this.state;

    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              IkubInfo PM
            </Link>
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/projects"} className="nav-link">
                    Projects
                  </Link>
                </li>
              )}

            {isAdmin && (
                <li className="nav-item">
                <Link to={"/stats"} className="nav-link">
                  Stats Dashboard
                </Link>
                </li>
              )}

              {isAdmin && (
                <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  Users
                </Link>
                </li>
              )}

            </div>

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                
              </div>
            )}
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/users" component={ListUsers} />
              <Route path="/edit-user" component={EditUser} />
              <Route path="/projects" component={ProjectList} />
              <Route path="/add-project" component={AddProject} />
              <Route path="/edit-project" component={EditProject} />
              <Route path="/tasks" component={TaskList} />
              <Route path="/add-task" component={AddTask} />
              <Route path="/edit-task" component={EditTask} />
              <Route path="/stats" component={Stats} />



            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;