import React from "react"
import cssModules from "react-css-modules"
import style from "./style.css"

import { default as Ticker } from "../Ticker"

export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={style.tickerColumns}>
        <Ticker socket={this.props.route.socket} symbol="TSLA" />
        <Ticker socket={this.props.route.socket} symbol="GOOG" />
        <Ticker socket={this.props.route.socket} symbol="AAPL" />
      </div>
    )
  }
}

export default cssModules(Home, style)