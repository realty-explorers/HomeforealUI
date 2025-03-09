import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Button,
  IconButton,
  styled,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';

import { Button as ShadButton } from '@/components/ui/button';

import LinearProgress from '@mui/material/LinearProgress';
import styles from './BuyboxItem.module.scss';
import clsx from 'clsx';
import BuyBox from '@/models/buybox';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import BallotIcon from '@mui/icons-material/Ballot';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InsightsIcon from '@mui/icons-material/Insights';
import BuyBoxLeads from './BuyBoxLeads';
import {
  buyBoxApi,
  useDeleteBuyBoxMutation
} from '@/store/services/buyboxApiService';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '@/components/Modals/Alerts/ConfirmDialog';
import { useState } from 'react';
import { useAnalyzeBuyBoxMutation } from '@/store/services/buyboxAnalysisApi';
import { useDispatch } from 'react-redux';
import { analysisApi } from '@/store/services/analysisApi';
import { timeSince } from '@/utils/dateUtils';
import Chip from '@/components/Chip';
import BuyBoxStatistics from './BuyBoxStatistics';
import { Trash2, Settings, BookOpenText } from 'lucide-react';

const StyledAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({}) => ({
  borderRadius: '0px',
  backgroundColor: 'transparent',
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
  borderRadius: '2rem',
  marginBottom: '1rem',
  backgroundColor: 'white',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const EDITOR_ROLES = ['owner', 'editor', 'maintainer'];

type BuyboxItemProps = {
  buybox: BuyBox;
  editBuyBox: (buybox: BuyBox) => void;
  setBuyBoxId: (buybox_id: string) => void;
  setPage: (page: number, pageSize: number) => void;
  buyboxId: string;
  page: number;
  pageSize: number;
};

const BuyboxItem = (props: BuyboxItemProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<any>();
  const [deleteBuyBox, deleteResult] = useDeleteBuyBoxMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [running, setRunning] = useState(false);

  const [analyzeBuyBox, analysisResult] = useAnalyzeBuyBoxMutation();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBuyBox(props.buybox.id).unwrap();

      const patchCollection = dispatch(
        buyBoxApi.util.updateQueryData(
          'getBuyBoxes',
          '',
          (buyBoxes: BuyBox[]) => {
            buyBoxes = buyBoxes.filter(
              (buybox) => buybox.id !== props.buybox.id
            );
            return buyBoxes;
          }
        )
      );
      enqueueSnackbar(`BuyBox Deleted`, {
        variant: 'success'
      });
    } catch (error) {
      if (error.status === 'FETCH_ERROR') {
        enqueueSnackbar(`Connection error - please try again later`, {
          variant: 'error'
        });
      } else {
        enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
          variant: 'error'
        });
      }
    }
  };
  const handleEditBuyBox = (e) => {
    e.stopPropagation();
    props.editBuyBox(props.buybox);
  };

  const handleAnalyzeBuyBoxClick = (e) => {
    e.stopPropagation();
    handleAnalyzeBuyBox();
  };

  const handleAnalyzeBuyBox = async () => {
    try {
      setRunning(true);
      await analyzeBuyBox(props.buybox.id).unwrap();
      dispatch(
        analysisApi.util.invalidateTags(['BuyBoxLeads', 'BuyBoxLeadsCount'])
      );
      dispatch(buyBoxApi.util.invalidateTags(['BuyBox']));
      // const patchCollection = dispatch(
      //   buyBoxApi.util.updateQueryData(
      //     "getBuyBoxes",
      //     "",
      //     (buyBoxes: BuyBox[]) => {
      //       const updatedBuyBox = buyBoxes.find((buybox) =>
      //         buybox.id === props.buybox.id
      //       );
      //       if (updatedBuyBox) {
      //         updatedBuyBox.execute_date = new Date();
      //       }
      //       return buyBoxes;
      //     },
      //   ),
      // );
      enqueueSnackbar(`Analysis Complete`, {
        variant: 'success'
      });
    } catch (error) {
      if (error.status === 'FETCH_ERROR') {
        enqueueSnackbar(`Connection error - please try again later`, {
          variant: 'error'
        });
      } else {
        enqueueSnackbar(`Error: ${error.data?.message || error.error}`, {
          variant: 'error'
        });
      }
    } finally {
      setRunning(false);
    }
  };

  const allowedToEdit = EDITOR_ROLES.includes(props.buybox.userAccess);

  const handleClick = () => {
    if (expanded) {
      props.setBuyBoxId('');
    } else {
      props.setBuyBoxId(props.buybox.id);
    }
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    if (props.buyboxId === props.buybox.id) {
      props.setPage(page, pageSize);
    }
  };

  const expanded = props.buyboxId === props.buybox.id;

  const [value, setValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <StyledAccordion
        expanded={expanded}
        onChange={handleClick}
        disabled={deleteResult.isLoading}
      >
        <StyledAccordionSummary
          expandIcon={<ExpandMoreIcon className="-rotate-90" />}
          className="flex-row-reverse"
        >
          <div className="flex justify-between w-full">
            <div className="flex items-center ">
              <Typography className="flex items-center w-40 text-ellipsis overflow-hidden">
                {props.buybox.parameters.name}
              </Typography>
              {/* {!running && props.buybox?.execute_date && ( */}
              {/*   <div className="flex gap-x-4"> */}
              {/*     <div className="flex items-center gap-x-4"> */}
              {/*       <Typography className="text-gray-500"> */}
              {/*         updated {timeSince(props?.buybox?.execute_date)} */}
              {/*       </Typography> */}
              {/*     </div> */}
              {/*   </div> */}
              {/* )} */}
            </div>

            {running ? (
              <div className="flex grow items-center px-36 gap-x-4">
                <div className="grow relative flex items-center gap-x-2">
                  <div className="absolute z-[1] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex">
                    <Typography
                      className={clsx([' text-white font-poppins font-bold'])}
                    >
                      Analyzing BuyBox
                    </Typography>
                    <Settings
                      fontSize="small"
                      className={clsx([styles.loading, 'text-white mx-2'])}
                    />
                  </div>

                  <LinearProgress
                    variant="indeterminate"
                    className="grow h-6 rounded-3xl"
                    // value={30}
                    // valueBuffer={30}
                  />
                  {/* <Typography>30%</Typography> */}
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <div className="flex gap-x-2">
              {allowedToEdit && !running && (
                <ShadButton
                  className="bg-red-500 hover:bg-red-700 text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="hidden md:flex">Remove</span>
                </ShadButton>
              )}
              {!running && (
                <ShadButton
                  className="bg-[#9747FF] hover:bg-[#5500c4] text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
                  onClick={handleEditBuyBox}
                >
                  {allowedToEdit ? (
                    <Settings className="h-5 w-5" />
                  ) : (
                    <BookOpenText className="h-5 w-5" />
                  )}

                  <span className="hidden md:flex">
                    {allowedToEdit ? 'Configure' : 'View'}
                  </span>
                </ShadButton>
              )}

              {allowedToEdit &&
                props.buybox.userAccess === 'admin' &&
                (running ? (
                  <Button
                    startIcon={<StopCircleIcon />}
                    className="bg-red-500 hover:bg-red-700 text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
                    onClick={handleEditBuyBox}
                    disabled
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    startIcon={<PlayCircleIcon />}
                    className="bg-green-500 hover:bg-green-700 text-[#FFFDFD] rounded-3xl p-2 px-4 font-poppins font-semibold  "
                    onClick={handleAnalyzeBuyBoxClick}
                  >
                    Run
                  </Button>
                ))}
            </div>
          </div>
        </StyledAccordionSummary>
        <AccordionDetails>
          <div className="bg-white rounded-lg h-full w-full">
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="icon label tabs example"
              className="w-full"
              centered
            >
              <Tab
                icon={<BallotIcon />}
                iconPosition="start"
                label="Leads"
                className=""
              />
              <Tab
                icon={<InsightsIcon />}
                iconPosition="start"
                label="Insights"
              />
            </Tabs>
            {value === 0 && (
              <BuyBoxLeads
                buybox={props.buybox}
                open={expanded}
                setPage={handleChangePagination}
                page={props.page}
                pageSize={props.pageSize}
              />
            )}
            {value === 1 && <BuyBoxStatistics />}
          </div>
        </AccordionDetails>
      </StyledAccordion>
      <ConfirmDialog
        title="Delete BuyBox"
        description={`Are you sure you want to delete "${props.buybox?.name}"?`}
        open={dialogOpen}
        setOpen={setDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default BuyboxItem;
