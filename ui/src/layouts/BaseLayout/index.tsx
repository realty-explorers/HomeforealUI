import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-1 h-[100dvh]">
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseLayout;
