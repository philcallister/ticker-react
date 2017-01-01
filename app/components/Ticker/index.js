import React from "react";

import cssModules from "react-css-modules";
import classNames from 'classnames/bind';
import style from "./style.css";

import { default as CandleStickChart } from "../CandleStickChart"

let cx = classNames.bind(style);

export class Ticker extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.symbol = props.symbol;

    let fakeTick = {l: "##", c: "##", cp: "##"};
    this.state = {currentInterval: 1, currentTick: fakeTick};
  }

  componentDidMount() {
    let that = this;
    this.channel = this.socket.channel(`quote:symbol:${this.symbol}`);
    this.channel.join();
    this.channel.on('quote', function(tick){
      that.setState({currentTick: tick})
    });
  }

  componentWillUnmount() {
    this.channel.leave();
  }

  render() {
    return (
      <div className={style.ticker}>
        <div className={this.headerClass()}>
          <div>
            <h3 className={style.symbol}>{this.symbol}</h3>
            <span className={style.value}>{this.state.currentTick.l}</span>
          </div>
          <div className={style.change}>
            <span className={style.value}>{this.state.currentTick.c}</span>
            <span className={style.value}>({this.state.currentTick.cp}%)</span>
          </div>
        </div>
        <CandleStickChart socket={this.socket} symbol={this.symbol} data={[]} type="hybrid" interval={this.state.currentInterval} />
        <div className={style.interval}>
          <button type="button" onClick={() => this.onClickInterval(1)}>1m</button>
          <button type="button" onClick={() => this.onClickInterval(2)}>2m</button>
          <button type="button" onClick={() => this.onClickInterval(5)}>5m</button>
          <button type="button" onClick={() => this.onClickInterval(15)}>15m</button>
          <button type="button" onClick={() => this.onClickInterval(30)}>30m</button>
          <button type="button" onClick={() => this.onClickInterval(60)}>1h</button>
        </div>
      </div>
    )
  }

  onClickInterval(interval) {
    this.setState({currentInterval: interval});
  }

  headerClass() {
    let change = this.detectChange();
    return cx({
      header: true,
      noChange: change == null,
      plusChange: change == '+',
      minusChange: change == '-'
    });
  }

  detectChange() {
    let tick = this.state.currentTick;
    let tickChange = tick.c.charAt(0);
    return (tickChange == '-' || tickChange == '+') ? tickChange : null
  }

}

export default cssModules(Ticker, style)
