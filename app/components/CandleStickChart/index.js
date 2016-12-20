"use strict";

import React from "react";
import { scaleTime } from "d3-scale";
import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, indicator, helper } from "react-stockcharts";

import cssModules from "react-css-modules";
import classNames from 'classnames/bind';
import style from "./style.css";

var { CandlestickSeries } = series;
var { XAxis, YAxis } = axes;
var { fitWidth } = helper;

export class CandleStickChart extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.symbol = props.symbol;
    this.state = {data: props.data}
  }

  componentDidMount() {
    let that = this;
    this.channel = this.socket.channel(`frame:symbol:${this.symbol}:1`);
    this.channel.join();
    this.channel.on('frame', function(frame){
      let date = new Date(frame.open.lt_dts);
      date.setSeconds(0,0);

      let current_data = that.state.data;
      let update_data = {date: date, open: +frame.open.l, high: +frame.high.l, low: +frame.low.l, close: +frame.close.l, volume: 0}

      current_data.push(update_data);
      that.setState({data: current_data});
    });
  }

  componentWillUnmount() {
    this.channel.leave();
  }
  
  render() {
    var { type, width, ratio } = this.props;
    var data = this.state.data;
    return (
      <ChartCanvas ratio={ratio} width={width} height={400}
          margin={{ left: 50, right: 50, top: 10, bottom: 30 }} type={type}
          seriesName={this.symbol}
          data={this.state.data}
          xAccessor={(d) => this.date_element(d)}
          xScale={scaleTime()}>

        <Chart id={1} yExtents={d => [d.high, d.low]}>
          <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
          <YAxis axisAt="left" orient="left" ticks={5} />
          <CandlestickSeries />
        </Chart>
      </ChartCanvas>
    );
  }

  date_element(d) {
    if (d) {
      return d.date
    }
  }

}

CandleStickChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  ratio: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChart.defaultProps = {
  type: "hybrid"
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;