import { Typography } from "@mui/material";
import { useState } from "react";
import clsx from "clsx";
import AccordionSection from "./AccordionSection";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./Settings.module.scss";

const UserManagement = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { user } = useUser();
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div className="flex flex-col p-8">
      <Typography className={styles.section_header}>
        User Management
      </Typography>
      <div className="mt-4">
        <AccordionSection
          name="profile"
          title="Profile"
          description="Name, Surname, Email address"
          expanded={expanded}
          handleChange={handleChange}
        >
          <Typography>Name: {user?.name}</Typography>
          <Typography>Email: {user?.email}</Typography>
          <Typography>Roles: {user?.user_roles}</Typography>
        </AccordionSection>
        <hr className="border-t border-black mx-4 my-2" />
        <AccordionSection
          name="password"
          title="Password"
          description={`Your email address is ${user?.email}`}
          expanded={expanded}
          handleChange={handleChange}
        >
          <Typography>meow</Typography>
        </AccordionSection>
        <hr className="border-t border-black mx-4 my-2" />

        <AccordionSection
          name="notifications"
          title="Notifications"
          description="Rateit will send you notifications"
          expanded={expanded}
          handleChange={handleChange}
        >
          <Typography>meow</Typography>
        </AccordionSection>
        <hr className="border-t border-black mx-4 my-2" />
        <AccordionSection
          name="deactivate"
          title="Deactivate Account"
          description="If you no longer want to receive* emails"
          expanded={expanded}
          handleChange={handleChange}
        >
          <Typography>meow</Typography>
        </AccordionSection>
      </div>
    </div>
  );
};

export default UserManagement;
