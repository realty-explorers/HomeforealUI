import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import clsx from "clsx";

type AccordionSectionProps = {
  name: string;
  title: string;
  description?: string;
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  children?: React.ReactNode;
};

const AccordionSection = (
  { name, title, description, expanded, handleChange, children }:
    AccordionSectionProps,
) => {
  return (
    <Accordion
      expanded={expanded === name}
      onChange={handleChange(name)}
      className="bg-transparent"
    >
      <AccordionSummary
        expandIcon={
          <ExpandCircleDownIcon
            className={clsx([
              expanded === name ? "text-[#590D82]" : "text-[#AAB2C8]",
            ])}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className="flex flex-col">
          <Typography className="text-lg text-black font-semibold">
            {title}
          </Typography>
          <Typography className="text-[#00002280]">
            {description}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionSection;
