import * as React from 'react';
import './App.css';
import * as d3 from 'd3';
import {FeatureCollection} from "geojson";

export interface ICensusMapProps {
    width: number;
    height: number;
}

export class CensusMap extends React.Component<ICensusMapProps, {}> {

    private svgNode: SVGSVGElement | null;

    constructor(props: ICensusMapProps) {
        super(props);
        this.renderMapWithD3 = this.renderMapWithD3.bind(this)
    }

    public componentDidMount() {
        this.renderMapWithD3();
    }

    public componentDidUpdate() {
        this.renderMapWithD3();
    }

    public render() {
        return <svg ref={node => this.svgNode = node} width={this.props.width} height={this.props.height}/>
    }

    private renderMapWithD3() {
        const svgNode = this.svgNode;
        const width = this.props.width;
        const height = this.props.height;

        const projection = d3.geoMercator()
  					.center([-73.94, 40.70])
  					.scale(50000)
  					.translate([(width) / 2, (height)/2]);

        const path = d3.geoPath().projection(projection);
        const svg = d3.select(svgNode);

        d3.json("2010_Census_Tracts.geojson").then( (geoData: FeatureCollection) => {
           svg.selectAll("path")
               .data(geoData.features)
               .enter()
               .append("path")
               .attr("d", path)
               .style("fill", "steelblue")
               .style("stroke", "black")
               .style("stroke-width", "1");

        }).catch( (error) => console.log(error) );
    }
}