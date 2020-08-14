import React from "react";
import "./ReadScore.scss";

import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

class ReadScore extends React.Component {

  render() {
    return (
      <div className="ReadScore" onClick={this.clickItem}>
        <div className="total_score">
          <Box mb={3} borderColor="transparent">
            <Rating
              name="read-only"
              precision={0.1}
              value={this.props.score?this.props.score:0}
              readOnly
            />
          </Box>
        </div>
      </div>
    );
  }
}

export default ReadScore;
