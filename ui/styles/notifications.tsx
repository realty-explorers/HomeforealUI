import { styled } from '@mui/system';
import { MaterialDesignContent } from 'notistack';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: '#2D7738'
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: '#970C0C'
  }
}));

export default StyledMaterialDesignContent;
