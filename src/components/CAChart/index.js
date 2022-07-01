import React, { Component } from 'react';
import CanvasJSReact from '../../utils/canvasjs/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Chart extends Component {

    constructor(props) {
        super(props);

        this.mouseDown = false;
        this.selected = null;
        this.xSnapDistance = undefined;
        this.ySnapDistance = undefined;
        this.timerId = null;
    }

    getPosition = (e) => {

        var dim = document.getElementsByClassName('canvasjs-chart-container')[0].getBoundingClientRect();
        var relX = e.pageX - dim.left;
        var relY = e.pageY - dim.top;
        this.xValue = Math.round(this.chart.axisX[0].convertPixelToValue(relX));
        this.yValue = Math.round(this.chart.axisY[0].convertPixelToValue(relY));

    }

    searchDataPoint = () => {
        var dps = this.chart.data[0].dataPoints;

        for (var i = 0; i < dps.length; i++) {

            if ((this.xValue >= dps[i].x - this.xSnapDistance && this.xValue <= dps[i].x + this.xSnapDistance) &&
                (this.yValue >= dps[i].y - this.ySnapDistance && this.yValue <= dps[i].y + this.ySnapDistance)) {
                if (this.mouseDown && (i != 0)) {
                    this.selected = i;
                    break;
                }
                else {
                    this.changeCursor = true;
                    break;
                }
            }
            else {
                this.selected = null;
                this.changeCursor = false;
            }
        }
    }

    componentDidMount() {
        document.getElementsByClassName('canvasjs-chart-container')[0].addEventListener('mousedown', (e) => {
            this.xSnapDistance = 30;//this.chart.axisX[0].convertPixelToValue(this.chart.get("dataPointWidth")) / 2;
            this.ySnapDistance = 3;

            this.mouseDown = true;
            this.getPosition(e);
            this.searchDataPoint();
        });

        document.getElementsByClassName('canvasjs-chart-container')[0].addEventListener('mouseup', (e) => {

            if (this.selected != null) {
                this.chart.data[0].dataPoints[this.selected].y = this.yValue;
                this.props.onChange && this.props.onChange(this.selected, this.yValue);
                this.chart.render();
                this.mouseDown = false;
            }
        });

        /*  document.getElementsByClassName('canvasjs-chart-container')[0].addEventListener('mousemove', (e) => {
              this.getPosition(e);
  
              if (this.mouseDown) {
                  clearTimeout(this.timerId);
                  this.timerId = setTimeout(() => {
                      if (this.selected != null) {
                          this.chart.data[0].dataPoints[this.selected].y = this.yValue;
                     //     this.props.onChange && this.props.onChange(this.selected, this.yValue);
                          this.chart.render();
                      }
                  }, 0);
              } else {
                  this.searchDataPoint();
                  if (this.changeCursor) {
                      this.chart.data[0].set("cursor", "n-resize");
                  }
                  else {
                      this.chart.data[0].set("cursor", "default");
                  }
              }
          });*/
    }

    render() {


        this._state = {
            data: [
                { label: "Janvier", y: this.props.data?.service[0] || 0 },
                { label: "Fevrier", y: this.props.data?.service[1] || 0 },
                { label: "Mars", y: this.props.data?.service[2] || 0 },
                { label: "Avril", y: this.props.data?.service[3] || 0 },
                { label: "Mai", y: this.props.data?.service[4] || 0 },
                { label: "Juin", y: this.props.data?.service[5] || 0 },
                { label: "Juillet", y: this.props.data?.service[6] || 0 },
                { label: "Aout", y: this.props.data?.service[7] || 0 },
                { label: "septembre", y: this.props.data?.service[8] || 0 },
                { label: "Octobre", y: this.props.data?.service[9] || 0 },
                { label: "Novembre", y: this.props.data?.service[10] || 0 },
                { label: "Decembre", y: this.props.data?.service[11] || 0 }
            ],
            data2: [
                { label: "Janvier", y: this.props.data?.product[0] || 0 },
                { label: "Fevrier", y: this.props.data?.product[1] || 0 },
                { label: "Mars", y: this.props.data?.product[2] || 0 },
                { label: "Avril", y: this.props.data?.product[3] || 0 },
                { label: "Mai", y: this.props.data?.product[4] || 0 },
                { label: "Juin", y: this.props.data?.product[5] || 0 },
                { label: "Juillet", y: this.props.data?.product[6] || 0 },
                { label: "Aout", y: this.props.data?.product[7] || 0 },
                { label: "septembre", y: this.props.data?.product[8] || 0 },
                { label: "Octobre", y: this.props.data?.product[9] || 0 },
                { label: "Novembre", y: this.props.data?.product[10] || 0 },
                { label: "Decembre", y: this.props.data?.product[11] || 0 }
            ]
        }

        const options = {
            animationEnabled: true,
            //exportEnabled: true,
            theme: "light2", // "light1", "dark1", "dark2"
            title: {
                text: this.props.title || ""  //"CA - " + new Date().getFullYear(),
            },
            data: [
                {
                    type: "column",
                    name: "Services",
                    showInLegend: true,  
                    dataPoints: (this._state.data || [])
                },
                {
                    type: "column",
                    name: "Produits",
                    showInLegend: true,  
                    dataPoints: (this._state.data2 || [])
                }
            ],
        }

        return <CanvasJSChart
            options={options}
            onRef={ref => this.chart = ref}
            ref="something"
        />
    }
}

export default Chart