import * as React from 'react';
import './CensusMap.css';
import * as d3 from 'd3';
import {FeatureCollection} from "geojson";
import * as L from 'leaflet';
import {GeoStream} from "d3";

export class CensusMap extends React.Component<{}, {}> {

    private leafletMapId = "leaflet-map-div";
    private newYorkLatLong: [number, number] = [40.70, -73.94];

    constructor(props: {}) {
        super(props);
        this.renderMap = this.renderMap.bind(this)
    }

    public componentDidMount() {
        this.renderMap();
    }

    public componentDidUpdate() {
        this.renderMap();
    }

    public render() {
        return (
            <div className="census-map-container">
                <div id={this.leafletMapId}/>
            </div>
        );
    }

    private renderMap() {
        const map = new L.Map(this.leafletMapId, {center: this.newYorkLatLong, zoom: 13})
            .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

        const svg = d3.select(map.getPanes().overlayPane).append("svg");
        const g = svg.append("g").attr("class", "leaflet-zoom-hide");


        d3.json("2010_Census_Tracts.geojson").then((geoData: FeatureCollection) => {
            const transform = d3.geoTransform({point: projectPoint});
            const path = d3.geoPath().projection(transform);

            const feature = g.selectAll("path")
                .data(geoData.features)
                .enter()
                .append("path");

            map.on({
                "viewreset": reset,
                "zoom": reset,
            });
            reset();

            function reset() {
                const bounds = path.bounds(geoData);
                const topLeft = bounds[0];
                const bottomRight = bounds[1];

                svg.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");

                g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                feature.attr("d", path);
            }

            // Use Leaflet to implement a D3 geometric transformation.
            function projectPoint(this: { stream: GeoStream }, x: number, y: number) {
                const point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }


        }).catch((error) => console.log(error));
    }
}