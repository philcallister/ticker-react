"use strict";

import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { scaleTime } from "d3-scale";


import { ChartCanvas, Chart, series, scale, coordinates, tooltip, axes, annotation, indicator, helper } from "react-stockcharts";

var { CandlestickSeries, BarSeries, LineSeries, AreaSeries } = series;
var { discontinuousTimeScaleProvider } = scale;

var { EdgeIndicator } = coordinates;
var { CrossHairCursor, MouseCoordinateX, MouseCoordinateY, CurrentCoordinate } = coordinates;
var { Annotate, LabelAnnotation, Label } = annotation;

var { OHLCTooltip, MovingAverageTooltip } = tooltip;
var { XAxis, YAxis } = axes;
var { ema, sma } = indicator;
var { fitWidth } = helper;

class CandleStickChart extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.symbol = props.symbol;
    this.state = {data: props.data, interval: props.interval};
  }

  componentDidMount() {
    this.resetChannel(this.state.data, this.state.interval);
  }

  componentWillUnmount() {
    this.channel.leave();
  }

  componentWillReceiveProps(props) {
    if (props.interval != this.state.interval) {
      this.setState({data: [], interval: props.interval});
      this.resetChannel(props.data, props.interval);
    }
  }

  resetChannel(data, interval) {
    if(this.channel) {
      this.channel.leave();
    }
    let that = this;
    this.channel = this.socket.channel(`frame:symbol:${this.symbol}:${interval}`);
    this.channel.join();

    // No frames loaded -- go get latest historical
    if (!data.length) {
      this.channel.push('all_frames', {symbol: this.symbol, interval: interval}).receive("ok", function(reply){
        if (!!reply.frames.length) {
          let elements = reply.frames.map(frame => that.frameToElement(frame));
          that.setState({data: elements});
        }
      });
    }

    // Receive new frame
    this.channel.on('frame', function(frame){
      let element = that.frameToElement(frame);
      let current_data = that.state.data;
      current_data.push(element);
      that.setState({data: current_data});
    });
  }

  frameToElement(frame) {
      let date = new Date(frame.close.lt_dts);
      date.setSeconds(0,0);
      return({date: date, open: +frame.open.l, high: +frame.high.l, low: +frame.low.l, close: +frame.close.l, volume: 0})
  }

  render() {
    var { type, width, ratio } = this.props;
    var data = this.state.data;

    var ema20 = ema()
      .id(0)
      .windowSize(20)
      .merge((d, c) => {d.ema20 = c})
      .accessor(d => d.ema20);

    var ema50 = ema()
      .id(2)
      .windowSize(50)
      .merge((d, c) => {d.ema50 = c})
      .accessor(d => d.ema50);

    var margin = { left: 80, right: 80, top: 30, bottom: 50 };
    var height = 400;

    var [yAxisLabelX, yAxisLabelY] = [width - margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2]
    if (data.length > 1) {
      let label = `${this.state.interval} minutes`;
      return (
        <ChartCanvas ratio={ratio} width={width} height={height}
            margin={margin} type={type}
            seriesName={this.symbol}
            data={this.state.data} calculator={[ema20, ema50]}
            xAccessor={d => d.date}
            xScale={scaleTime()}>

          <Label x={(width - margin.left - margin.right) / 2} y={30}
              fontSize="26" text={this.symbol}/>

          <Chart id={1}
              yExtents={[d => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
              padding={{ top: 10, bottom: 20 }}>
            <XAxis axisAt="bottom" orient="bottom"/>
            <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={timeFormat("%I:%M%p")} />
            <MouseCoordinateY
                at="right"
                orient="right"
                displayFormat={format(".2f")} />

            <Label x={(width - margin.left - margin.right) / 2} y={height - 45}
                fontSize="12" text={label} />

            <YAxis axisAt="right" orient="right" ticks={5} />

            <CandlestickSeries />
            <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()}/>
            <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>

            <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
            <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
            <EdgeIndicator itemType="last" orient="right" edgeAt="right"
              yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

            <OHLCTooltip origin={[-40, 0]}/>
            <MovingAverageTooltip onClick={(e) => console.log(e)} origin={[-38, 15]}
              calculators={[ema20, ema50]}/>

          </Chart>
          <CrossHairCursor strokeDasharray="LongDashDot" />
        </ChartCanvas>
      );
    }
    else {
      return null;
    }
  }
}

CandleStickChart.propTypes = {
  data: React.PropTypes.array.isRequired,
  width: React.PropTypes.number.isRequired,
  ratio: React.PropTypes.number.isRequired,
  type: React.PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
  type: "hybrid",
};

CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;