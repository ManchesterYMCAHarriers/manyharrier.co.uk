import React from "react"
import * as PropTypes from "prop-types"

export const PanelFullWidth = ({children}) => (
  <div className="w-full mt-4 flex">
    {children}
  </div>
)

PanelFullWidth.propTypes = {
  children: PropTypes.node.isRequired,
}

export const Panel = ({children}) => (
  <div className="w-full mt-4 md:w-1/2 md:odd:pr-2 md:even:pl-2 flex">
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.node.isRequired,
}

export const Panels = ({className, children}) => (
  <div className={"w-full flex flex-wrap".split(" ").concat(className.split(" ")).join(" ")}>
    {children}
  </div>
)

Panels.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

Panels.defaultProps = {
  className: "",
}
