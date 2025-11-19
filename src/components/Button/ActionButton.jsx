import React from "react";
import { Button } from "antd";

const ActionButton = ({
  isActive,
  onClick,
  activeLabel,
  inactiveLabel,
  label,
  className = "",
  ...rest
}) => {
  const buttonLabel = label || (isActive ? activeLabel : inactiveLabel);

  return (
    <Button onClick={onClick} className={className} {...rest}>
      {buttonLabel}
    </Button>
  );
};

export default ActionButton;
