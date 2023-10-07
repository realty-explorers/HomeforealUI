import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import AccordionSection from "./AccordionSection";
import styles from "./Settings.module.scss";

const Subscriptions = () => {
  const { user } = useUser();
  const trialExpirationDate = user?.app_metadata?.trial_expiration_date;
  const trialEndsIn = new Date(trialExpirationDate).toLocaleDateString();
  const daysLeft = Math.floor(
    (new Date(trialExpirationDate).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  );

  const [expanded, setExpanded] = useState<string | false>(false);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="flex flex-col p-8">
      <Typography className={styles.section_header}>
        Subscriptions
      </Typography>
      <div className="mt-8">
        <Typography className={styles.subscriptions_section_header}>
          Current Plan
        </Typography>
        <div id="current_plan">
          <Typography className="text-2xl font-semibold text-black mt-4">
            Starter Package
          </Typography>
          <Typography className="text-xl text-black my-4">
            Trial ends in: {daysLeft} days
          </Typography>
          <div className="flex gap-x-4 mb-4">
            <Button className="bg-[#590D82] hover:bg-[#ac37eb] text-white px-4 py-2 text-[1rem]">
              Upgrade Plan
            </Button>
            <Button className="border border-solid border-[#590D82] text-[#590D82] bg-transparent px-4 py-2 text-[1rem]">
              Cancel Plan
            </Button>
          </div>
          <Typography>Your plan will expire on {trialEndsIn}</Typography>
        </div>
      </div>
    </div>
    // <div>Your trial ends in: {trialEndsIn}, you have {daysLeft} days left</div>
  );
};

export default Subscriptions;
