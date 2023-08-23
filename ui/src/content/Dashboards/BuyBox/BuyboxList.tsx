import {
  Grid,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  AccordionProps,
  styled,
  AccordionSummaryProps,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BuyboxItem from './BuyboxItem';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#2d3748' : '#f5f5f5',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const BuyboxItemWrapper = () => {
  return (
    <StyledAccordion sx={{ width: '100%' }}>
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Accordion Title</Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <BuyboxItem />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

type BuyboxListProps = {};
const BuyboxList = (props: BuyboxListProps) => {
  return (
    <Grid container>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          {Array.from(Array(5).keys()).map((i) => (
            <BuyboxItemWrapper key={i} />
          ))}
          <StyledAccordion sx={{ width: '100%' }}>
            <StyledAccordionSummary expandIcon={<AddCircleOutlineIcon />}>
              <Typography>New Buybox</Typography>
            </StyledAccordionSummary>
          </StyledAccordion>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default BuyboxList;
