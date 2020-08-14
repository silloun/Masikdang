import React from "react";

// Context 만들 때마다 HoC를 작성하는게 귀찮거나
// 같은 Context를 사용하지만 상황에 따라 다른 props를 전달해줘야 할 때
const createUseConsumer = (Consumer) => (mapContextToProps) => (WrappedComponent) => {
  // mapContextToProps 가 없으면 그냥 context를 그대로 props 에 전달
  const defaultMapContextToProps = (context) => ({ context });

  function UseConsumer(props) {
    return (
      <Consumer>
        {(context) => {
          // context에서 원하는 값 추출
          const contextProps = (mapContextToProps || defaultMapContextToProps)(context);

          return <WrappedComponent {...contextProps} {...props} />;
        }}
      </Consumer>
    );
  }

  // displayName 설정
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "component";
  UseConsumer.displayName = `UseConsumer(${displayName})`;
  return UseConsumer;
};

export default createUseConsumer;
