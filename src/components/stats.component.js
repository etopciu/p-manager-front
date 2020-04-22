import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatsService from "../services/stats.service";
import projectService from "../services/project.service";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-theme-default/dist/all.css';
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const taskChartConfigs = {
    type: "column2d", 
    width: "900", 
    height: "300", 
    dataFormat: "json", 
    dataSource: {
      chart: {
        caption: "Chart of Task Statuses",   
        subCaption: "",            
        xAxisName: "Statuses",          
        yAxisName: "Count",  
        numberSuffix: "",
        theme: "fusion"                
      },
       data: []
    }
  };

  const taskPChartConfigs = {
    type: "column2d", 
    width: "900", 
    height: "300", 
    dataFormat: "json", 
    dataSource: {
      chart: {
        caption: "Chart of Task Statuses",   
        subCaption: "",            
        xAxisName: "Statuses",          
        yAxisName: "Count",  
        numberSuffix: "",
        theme: "fusion"                
      },
       data: []
    }
  };

  const userChartConfigs = {
    type: "pie3d", 
    width: "900", 
    height: "300", 
    dataFormat: "json", 
    dataSource: {
        chart: {
            caption: "Chart of Active Users",
            numberPrefix: "",
            showPercentInTooltip: "0",
            decimals: "1",
            theme: "fusion",
            tooltipBorderRadius: "20"
          },
       data: []
    }
  };

 

  const userPChartConfigs = {
    type: "pie3d", 
    width: "900", 
    height: "300", 
    dataFormat: "json", 
    dataSource: {
        chart: {
            caption: "Chart of Active Users",
            numberPrefix: "",
            showPercentInTooltip: "0",
            decimals: "1",
            theme: "fusion",
            tooltipBorderRadius: "20"
          },
       data: []
    }
  };

export default class Stats extends Component {
  constructor(props) {
    super(props);

    this.state = {
        stats:[],
        statsByProject:[],
        projects:[],
        projectId:[],
        showP:false
    };

    this.getStats = this.getStats.bind(this);
    this.getStatsByProject = this.getStatsByProject.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.editProject = this.editProject.bind(this);

  }

  componentDidMount() {
      this.getStats();
      this.getProjects();
  }

  getProjects(){
    projectService.getProjects()
        .then(
        response => {
            console.log(response);
            this.setState({ projects: response.data })
        } )
  }

  getStats(){
    StatsService.getStats()
        .then(
        response => {
            console.log(response);
            this.setState({ stats: response.data });
            taskChartConfigs.dataSource.data = this.state.stats.taskStatuses;
            userChartConfigs.dataSource.data = this.state.stats.activeUsers
        } 
        )
  }

  getStatsByProject(projectId){
      StatsService.getStatsByProject(projectId)
        .then(
            response => {
                this.setState({statsByProject: response.data});
                taskPChartConfigs.dataSource.data = this.state.statsByProject.taskStatuses;
                userPChartConfigs.dataSource.data = this.state.statsByProject.activeUsers;
                console.log(taskPChartConfigs.dataSource.data);
                console.log(userPChartConfigs.dataSource.data);
                this.setState({
                    showP: true
                });
            }
        )
  }

  editProject(id) {
    window.localStorage.setItem("projectId", id);
    this.props.history.push('/edit-project');
  }

  handleProjectChange = (e) => {
    
    window.localStorage.setItem("projectId",e.target.value.id)
    this.getStatsByProject(window.localStorage.getItem("projectId"))
}

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Stats Dashboard</h3>
        </header>
            <div> 
                <div>
                <Container>
                    <Row>
                        <Card>
                            <Card.Body>Total projects: {this.state.stats.projects} </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>Total tasks: {this.state.stats.tasks} </Card.Body>
                        </Card>
                    </Row>
                </Container>
                   
                    <ReactFC {...taskChartConfigs} />                 <ReactFC {...userChartConfigs} />
                </div>

                <div>
                      <div className="jumbotron"> Stats by Project :  
                        <span>
                            <DropDownList
                                            data={this.state.projects}
                                            onChange={this.handleProjectChange}
                                            textField="title"
                                            dataItemKey="id"
                                        />
                        </span>
                      </div>
                   
                   {this.state.showP &&  
                        <div>
                            <Container>
                                <Row>
                                    <Card>
                                     <Card.Link href="/edit-project" > <Card.Body  >Project Title: {this.state.statsByProject.title} </Card.Body>  </Card.Link>
                                    </Card>
                                    <Card>
                                     <Card.Link href="/tasks" >    <Card.Body>Total completed tasks: {this.state.statsByProject.count}</Card.Body> </Card.Link>
                                    </Card>
                                </Row>
                                <Row>
                                    <Card>
                                        <Card.Body>Total Tasks time : {this.state.statsByProject.sum} min </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>Average Task Time: {this.state.statsByProject.average} min </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>Min Task time : {this.state.statsByProject.min} min </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Body>Max Task Time: {this.state.statsByProject.max} min </Card.Body>
                                    </Card>
                                </Row>
                            </Container>

                            <ReactFC {...taskPChartConfigs} /> <ReactFC {...userPChartConfigs} />
                        </div>
                    }
                    
                </div>
            </div>
        </div>
    );
  }
}