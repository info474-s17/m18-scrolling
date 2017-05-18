import * as d3 from 'd3';
import React from 'react';
import './Map.css';
class Map extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
    }
    // On mount, set up
    componentDidMount() {
        this.setUp()
    }
    // Add static components
    setUp() {
        // Constants
        var width = this.props.width || 960,
            height = this.props.height || 700,
            projection = this.props.projection || d3.geoEquirectangular(),
            projScale = this.props.projScale || 300000,
            center = this.props.center || [47.6062, -122.3321],
            translate = this.props.translate || [889650.9716558016, 890196.9716558016],
            circleRange = this.props.circleRange || [2, 30];

        this.svg = d3.select(this.root)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Map projection
        this.projection = projection.scale(projScale)
            .center(center)
            .translate(translate);

        // Scales
        this.circleScale = d3.scaleLinear().range(circleRange);
        this.setScales()
        this.pathGen = d3.geoPath(projection);

        // Static map features
        this.mapG = this.svg.append("g")
            .attr("class", "counties")
            .attr('transform', 'scale(.4)translate(' + 1800 + ',' + 500 + ')')
    }
    draw() {
        this.setScales();
        // Data join
        let elements = this.mapG.selectAll("path")
            .data(this.props.shapefile.features);

        // Entering elements (paths)
        elements
            .enter().append("path")
            .attr("fill", function(d) {
                return 'none'
            })
            .attr("d", this.pathGen)
            .attr("stroke", "black")
            .attr('stroke-width', '.5');

        // Entering elements (circles)
        elements.enter().append("circle")
            .attr('cx', (d) => this.pathGen.centroid(d)[0])
            .attr('cy', (d) => this.pathGen.centroid(d)[1])
            .attr('r', (d) => this.circleScale(this.props.data[d.properties.GEOID[0]]))
            .style('fill', 'green')
            .style('opacity', .5);

        // Change circle colors
        this.svg.selectAll('circle')
            .transition()
            .duration(500)
            .attr('r', (d) => this.circleScale(this.props.data[d.properties.GEOID[0]]))
            .style('fill', function(d) {
                let color = this.props.data[d.properties.GEOID[0]] > 0 ? 'green' : 'purple'
                return color;
            }.bind(this));

    }
    setScales() {
        let values = Object.values(this.props.data);
        let min = d3.min(values);
        let max = d3.max(values);
        this.circleScale.domain([min, max]);
    }
    // Update on new props
    componentWillReceiveProps(props) {
        this.props = props;
        this.draw();
    }
    render() {
        return (<div width={ this.props.width } className='map-container' height={ this.props.height } ref={ (node) => {
                                                                                                 this.root = node;
                                                                                             } } />)
    };
}
;

export default Map;

