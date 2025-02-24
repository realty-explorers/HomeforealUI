import {
  Badge,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  useTheme
} from '@mui/material';
import Link from 'src/components/Link';
import Image from 'next/image';

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo() {
  const theme = useTheme();

  return (
    <TooltipWrapper title="Realty Explorers" arrow>
      <Image
        src="/static/images/logo/full-logo.png"
        alt="logo"
        width={160}
        height={60}
      />
    </TooltipWrapper>
  );
}

export default Logo;
