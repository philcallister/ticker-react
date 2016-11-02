import React from "react"
import expect from "expect"
import { shallow } from "enzyme"

import { Home } from "./"

describe("<Home />", () => {
  it("should render", () => {
    const renderedComponent = shallow(
      <Home />
    )
    expect(renderedComponent.is("div")).toEqual(true)
  })
})