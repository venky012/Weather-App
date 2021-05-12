import React, { Component } from "react";
import "./App.css";
import Moment from "moment";

import CanvasJSReact from './assets/canvasjs.react';
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

const api = {
  key: "60143b0f6b743491bfc4ae2161177145",
  baseUrl: "https://api.openweathermap.org/data/2.5/",
};

class App extends Component {
  state = {
    query : "srikakulam",
    error : false,
    loading : false,
    weather : {},
    forecast : {},
    todayweather : [],
    metric : "metric"
  }

  componentDidMount(){

  }

  // call the api
  search = async (evt) => {
    if (evt.key === "Enter") {
      this.setState({loading:true})

      // we use this api to get the forecast information for next 7 days (wind speed, minimum and maximum temperature)
      await fetch(`${api.baseUrl}forecast/daily?q=${this.state.query}&cnt=7&units=${this.state.metric}&APPID=d94bcd435b62a031771c35633f9f310a`)
        .then((res) => res.json())
        .then((result => {
            if(result.cod === 404){
              this.setState({
                error : true,
                forecast : {}
              });
            }
            else{
              this.setState({
                forecast : result.list
              })
            }
        }));

      // we use this api to get weather information of today get wind speed, temperature , how we feel the temperature, ...
      await fetch(`${api.baseUrl}weather?q=${this.state.query}&units=${this.state.metric}&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result => {
            if(result.cod === 404){
              this.setState({
                error : true,
                weather : {}
              })
            }
            else{
              this.setState({
                error : false,
                weather : result
              })
            }
        }));

      // we use this api to get forecast information of today (get temperature on timely basis)
      await fetch(`${api.baseUrl}forecast?q=${this.state.query}&units=${this.state.metric}&cnt=5&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result => {
            if(result.cod === 404){
              this.setState({
                error : true,
                todayweather : []
              })
            }
            else{
              this.setState({
                error : false,
                todayweather : result.list
              })
            }
        }));

      this.setState({loading : false})
    }
  };

  changeMetrics = async (e) =>{
    await this.setState({ metric : e.target.value }, () => {
    }); 
    e.key = "Enter"
    await this.search(e);
  }

  getDate = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date}th ${month} ${year} `;
  };

  _renderDayName = (dt) => {
    let days = {
      sameDay: "[Today]",
      nextDay: "ddd",
      nextWeek: "ddd",
      lastDay: "ddd",
      lastWeek: "ddd"
    }

    return Moment(dt * 1000).calendar(null, days)
  };
  render () {

    const {query,metric,error,loading,weather,forecast,todayweather} = this.state;
    let dataPoints = []
    if(todayweather && todayweather.length!==0 && todayweather[0].main){
      dataPoints = [
        {
          "x": 9,
          "y": todayweather[0]['main']['temp']
        },
        {
          "x": 12,
          "y": todayweather[1]['main']['temp']
        },
        {
          "x": 15,
          "y": todayweather[2]['main']['temp']
        },
        {
          "x": 18,
          "y": todayweather[3]['main']['temp']
        },
        {
          "x": 21,
          "y": todayweather[4]['main']['temp']
        }
      ]
    }

    let me =  metric === "metric" ? "C" : "F"

    const options = {
			theme: "light2",
			title: {
				text: "Today weather report"
			},
			axisY: {
				title: `Temperature (°${me})`,
			},
			axisX: {
				title: "Time (24hr format)",
        minimum:9,
        maximum:21
			},
			data: [{
				type: "line",
				dataPoints: dataPoints
			}]
		}
    return (
      <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'App warm' : 'App'):'App'}>
        <div className="custom-container">
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-brand">Weather App</div>
  
            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
              <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item active">
                </li>
              </ul>
              <div className="form-inline my-2 my-lg-0">
                <div class="form-group mr-sm-2">
                  <select class="form-control" name="scale" onChange={this.changeMetrics} value={metric}>
                    <option key="metric" value="metric">Standard metric</option>
                    <option key="Imperial" value="Imperial">Imperial units</option>
                  </select>
                </div>
              </div>
              <div className="form-inline my-2 my-lg-0">
                <input
                  type="text"
                  className="form-control mr-sm-2"
                  placeholder="Search..."
                  onChange={(e) => this.setState({query : e.target.value})}
                  value={query}
                  onKeyPress={this.search}
                  autoFocus={true}
                />
              </div>
            </div>
          </nav>
          {
            loading ? (
              <div className="container">
                <h1 style={{fontSize:'30px',color:'white',marginTop:'30px',textAlign:'center'}}>Loading....</h1>
              </div>
              ) :
          ( error ? (
            <div className="container">
              <h1 style={{fontSize:'30px',color:'white',marginTop:'30px',textAlign:'center'}}>Sorry unable to find weather feather forecast of {query}.</h1>
            </div>
          ) :(typeof weather.main != "undefined" ? (
            <div>
              <div className="location_box">
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="date">{this.getDate(new Date())}</div>
              </div>
  
              <div className="weather_box">
                <div className="temp">{Math.round(weather.main.temp)}° {metric === "metric" ? "C" : "F"}</div>
                <div style={{color:'white'}}>Wind speed : {Math.round(weather.wind.speed)} {metric === "metric" ?  "meter/sec" : "miles/hour"}</div>
                <div style={{color:'white'}}>Feels like : {Math.round(weather.main.feels_like)}° {metric === "metric" ? "C" : "F"}</div>
                <div className="weather">{weather.weather[0].description}</div>
              </div>
              <br />
              <br />
              <div className="container" style={{maxWidth:'700px'}}>
                <CanvasJSChart options = {options} 
                  onRef={ref => this.chart = ref}
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
              </div>
              <br />
              <br />
              <br />
              <div className="container" style={{margin:'auto',color:'white'}}>
                <h3 className="temp" style={{textAlign:'center'}}>Predicitons for next 7 days</h3>
                <div class="table-responsive">
                  <table class="table" style={{color:'white'}}>
                    <thead>
                      <tr>
                        <th scope="col">Day</th>
                        <th scope="col">Max (° {metric === "metric" ? "C" : "F"})</th>
                        <th scope="col">Min (° {metric === "metric" ? "C" : "F"})</th>
                        <th scope="col">Wind ({metric === "metric" ? "meter/sec" : "miles/hour"})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        forecast && forecast.length!==0 && forecast.map((d)=>(
                          <tr>
                            <th scope="row">{this._renderDayName(d.dt)}</th>
                            <td>{d.temp.max}</td>
                            <td>{d.temp.min}</td>
                            <td>{d.speed}</td>
                          </tr>
                        ))
                      }
                    </tbody>    
                    
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="container">
                <h1 style={{fontSize:'30px',color:'white',marginTop:'50px',textAlign:'center'}}>Find the weather forecast</h1>
            </div>
          )))
          }
        </div>
      </div>
    );
  }
}

export default App;
