import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class WeatherGraph extends Component {
    render() {
        let { data, title } = this.props;
        let categories = [];
        let highTemp = [];
        let lowTemp = [];
        let condition = [];
        for (let i = 0; i < 7; i++) {
            categories.push(data[i].day);
            highTemp.push(data[i].high);
            lowTemp.push(data[i].low);
            condition.push(data[i].text);
        }

        let options = {
            title: {
                text: title,
                x: -20
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                labels: {
                    formatter: function () {
                        return this.value + '°'
                    }
                }
            },
            tooltip: {
                valueSuffix: '°C',
                formatter: function () {
                    let t = 'High';
                    if (this.series.userOptions.high) t = 'High';
                    if (this.series.userOptions.low) t = 'Low';
                    return 'Day: <b>' + this.x + '</b><br>' + t + ' Temperature: <b>' + this.y + '</b><br/>Weather Condition: <b>' + this.series.userOptions.description[this.point.index] + '</b>';
                }
            },
            legend: {
                enabled: false,
            },
            series: [{
                high: true,
                lineColor: '#F00',
                data: highTemp,
                description: condition,
            }, {
                low: true,
                lineColor: '#99F',
                data: lowTemp,
                description: condition,
            }]
        };
        return <HighchartsReact highcharts={Highcharts} options={options} />
    }
}

export default WeatherGraph;