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
        <Ticker socket={this.props.route.socket} symbol="P" />
        <Ticker socket={this.props.route.socket} symbol="ZNGA" />
        <Ticker socket={this.props.route.socket} symbol="VWO" />
        <Ticker socket={this.props.route.socket} symbol="BAC" />
      </div>
    )
  }
}

export default cssModules(Home, style)