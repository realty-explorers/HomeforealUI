import Deal from '@/models/deal';
import { Grid, styled, Pagination, Grow } from '@mui/material';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import PropertyCard from './PropertyCard';

const CardsPagination = styled(Pagination)(
  ({ theme }) => `
    margin-top: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
`
);

const transitionDuration = 300;

type PropertiesProps = {
  deals: Deal[];
  setSelectedDeal: (deal: Deal) => void;
};
const Properties: React.FC<PropertiesProps> = (props: PropertiesProps) => {
  //0 1 2 3 4 5
  //0 1 1 1 1 2
  //0 0 0 0 1 1
  const [perPage, setPerPage] = useState<number>(4);
  const [page, setPage] = useState<number>(1);
  const [transitionDone, setTransitionDone] = useState<boolean>(true);

  const pagesCount = () => {
    if (props.deals.length <= 1) return props.deals.length;
    return Math.floor((props.deals.length - 1) / perPage + 1);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setTransitionDone(false);
    setTimeout(() => {
      setTransitionDone(true);
      setPage(value);
    }, transitionDuration);
  };

  return (
    <>
      <Grid container>
        <Grow
          in={transitionDone}
          style={{ transformOrigin: '0 0 0' }}
          timeout={transitionDuration}
        >
          <Grid container spacing={3}>
            {props.deals
              .slice((page - 1) * perPage, page * perPage)
              .map((deal: Deal, index: number) => {
                return (
                  <Grid xs={12} sm={6} md={3} item key={index}>
                    <PropertyCard
                      deal={deal}
                      setSelectedDeal={props.setSelectedDeal}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Grow>

        <Grid xs={12} justifyItems="center" alignContent="center">
          <CardsPagination
            count={pagesCount()}
            page={page}
            onChange={handleChange}
            color="primary"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Properties;
