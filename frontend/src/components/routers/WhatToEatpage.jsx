import React from "react";
import Counter from "../whatToEat/Counter";
import QuestionNum from "../whatToEat/QuestionNum";
import WhatToEat from "../whatToEat/WhatToEat";
import "../whatToEat/WhatToEat.scss";

const WhatToEatpage = () => {
  return (
    <div className="WhatToEatComponent">
      <QuestionNum />
      <WhatToEat />
      <br />
      <Counter />
    </div>
  );
};

export default WhatToEatpage;
