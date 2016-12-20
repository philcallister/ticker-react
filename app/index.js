import "./styles/reset.css"
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, hashHistory } from "react-router"

import { default as Home } from "./components/Home"
import { Socket } from "./js/phoenix.js"

let socket = new Socket("ws://localhost:4000/socket");
socket.connect();

const App = props => (<div>{props.children}</div>)

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute socket={socket} component={Home} />
    </Route>
  </Router>,
  document.getElementById("root")
)