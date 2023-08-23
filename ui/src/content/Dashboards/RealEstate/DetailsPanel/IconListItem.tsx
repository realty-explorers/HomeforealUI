import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  alpha,
  styled
} from '@mui/material';
import React from 'react';

const StyledListItem = styled(ListItem)(
  ({ theme }) => `
  padding: 0;
  padding-bottom: ${theme.spacing(1)};
  `
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  // padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
    height: ${theme.spacing(4.5)};
    width: ${theme.spacing(4.5)};
  }
`
);

type IconListItemProps = {
  icon: React.ReactNode;
  title: string;
  value: any;
};

const IconListItem = (props: IconListItemProps) => {
  return (
    <StyledListItem disableGutters>
      {/* <ListItemAvatarWrapper>{props.icon}</ListItemAvatarWrapper> */}
      <ListItemText
        primary={props.title}
        primaryTypographyProps={{ variant: 'h5', noWrap: true }}
        secondaryTypographyProps={{
          variant: 'subtitle2',
          noWrap: true
        }}
      />
      <Box>
        <Typography align="right" variant="h6" noWrap>
          {props.value}
        </Typography>
      </Box>
    </StyledListItem>
  );
};

export default IconListItem;
