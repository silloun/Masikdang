import React from "react";
import Slider from "@material-ui/core/Slider";

class AgeSlider extends React.Component {

  valuetext = (value) => {
    this.props.changeAge(value);
  };

  render() {
    return (
      <Slider
        defaultValue={30}
        getAriaValueText={this.valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />
    );
  }
}

export default AgeSlider;
