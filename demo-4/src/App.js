// Application
import React from 'react';
import * as d3 from 'd3';
import './App.css';
import ScatterPlotComponent from './ScatterPlotComponent'
import Controls from './Controls';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            xVar: 'fertility_rate',
            yVar: 'life_expectancy',
            idVar: 'country',
            search: ''
        }
    }
    componentWillMount() {
        // Get data
        d3.csv('data/prepped_data.csv', function(data) {
            this.setState({
                data: data
            })
        }.bind(this))
    }
    changeX(event, index, value) {
        this.setState({
            xVar: value
        })
    }
    changeY(event, index, value) {
        this.setState({
            yVar: value
        })
    }
    search(event) {
        this.setState({
            search: event.target.value.toLowerCase()
        })
    }
    render() {
        // Prep data
        let chartData = this.state.data.map((d) => {
            let selected = d[this.state.idVar].toLowerCase().match(this.state.search) !== null;
            return {
                x: d[this.state.xVar],
                y: d[this.state.yVar],
                id: d[this.state.idVar],
                selected: selected
            }
        });

        let titleMap = {
            gdp: 'Gross Domestic Product',
            life_expectancy: 'Life expectancy in 2014',
            fertility_rate: 'Fertility Rate'
        };

        let titles = {
            x: titleMap[this.state.xVar],
            y: titleMap[this.state.yVar]
        };

        // Return ScatterPlot element
        return ( <div>
                   <h1 className="header"> Demo 4</h1>
                   <Controls changeX={ this.changeX.bind(this) } changeY={ this.changeY.bind(this) } xVar={ this.state.xVar } yVar={ this.state.yVar } search={ this.search.bind(this) } />
                   { this.state.data.length !== 0 &&
                     <div className="App">
                       <ScatterPlotComponent xTitle={ titles.x } yTitle={ titles.y } search={ this.state.search } data={ chartData } width={ window.innerWidth * .7 } height={ window.innerHeight - 220 }
                       />``
                     </div> }
                 </div>
            );
    }
}

export default App;