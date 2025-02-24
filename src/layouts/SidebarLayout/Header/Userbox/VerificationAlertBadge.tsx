import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/store/hooks';
import {
  selectAuth,
  setShowVerificationDialog
} from '@/store/slices/authSlice';
import { CircleAlert } from 'lucide-react';
import { useSelector } from 'react-redux';

const VerificationAlertBadge = (props: any) => {
  const dispatch = useAppDispatch();
  const {} = useSelector(selectAuth);
  return (
    <Badge
      variant="destructive"
      className="flex gap-x-2 h-auto cursor-pointer"
      onClick={() => {
        dispatch(setShowVerificationDialog(true));
      }}
    >
      {/* <InfoCircledIcon className="h-4 w-4 mr-1" /> */}
      {/* <ReportProblemTwoToneIcon fontSize="small" sx={{ mr: 1 }} /> */}
      <CircleAlert className="h-4 w-4 " />
      <span className="hidden sm:inline">Unverified</span>
    </Badge>
  );
};

export default VerificationAlertBadge;
