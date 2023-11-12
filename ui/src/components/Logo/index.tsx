import {
  Box,
  ListItem,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.scss";

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
        margin-top: 4px;
        transform: scale(.8);
`,
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.general.reactFrameworkColor};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.palette.primary.main};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.palette.secondary.main};
        }
`,
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.background};
`,
);

const LogoTextWrapper = styled(Box)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
`,
);

const VersionBadge = styled(Box)(
  ({ theme }) => `
        background: ${theme.palette.success.main};
        color: ${theme.palette.success.contrastText};
        padding: ${theme.spacing(0.4, 1)};
        border-radius: ${theme.general.borderRadiusSm};
        text-align: center;
        display: inline-block;
        line-height: 1;
        font-size: ${theme.typography.pxToRem(11)};
`,
);

const LogoText = styled(Box)(
  ({ theme }) => `
`,
);

function Logo() {
  // return <></>;
  return (
    <Link href="/">
      <div className="flex items-center h-full">
        <div className="flex items-center justify-center w-8 ml-2 mr-1">
          <Image
            src="/static/images/logo/hlogo.png"
            alt="logo"
            width={50}
            height={50}
          />
        </div>
        <Typography className={styles.logoText}>
          Homeforeal
        </Typography>
      </div>
    </Link>
  );
}

export default Logo;
