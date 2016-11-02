import React from "react"
import cssModules from "react-css-modules"
import style from "./style.css"

export class Ticker extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.symbol = props.symbol;
    this.state = {ticks: []};
  }

  componentDidMount() {
    let that = this;
    this.channel = this.socket.channel(`symbol:${this.symbol}`);
    this.channel.join();
    this.channel.on('quote', function(data){
      that.setState({ticks: that.state.ticks.concat(data)})
    });
  }

  componentWillUnmount() {
    this.channel.leave();
  }

  render() {
    let tickList = this.state.ticks.map(function(tick, i){
        return(<li key={i}>{tick.lt} => {tick.c}</li>);
    });
    return (
        <div className={style.ticker}>
          <h3 className={style.header}>{this.symbol}</h3>
          <ul>{tickList}</ul>
        </div>
    )
  }
}

export default cssModules(Ticker, style)
