import { Button } from '@/components/ui/button';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw
} from 'lucide-react';

interface WizardNavigationFooterProps {
  handleReset: () => void;
  currentStep: number;
  totalSteps: number;
  hanldeGoToBack: () => void;
  handleGoToNext: () => void;
  handleSubmit: () => void;
  loading: boolean;
}
const WizardNavigationFooter = ({
  handleReset,
  currentStep,
  totalSteps,
  handleGoToBack,
  handleGoToNext,
  handleSubmit,
  loading
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 gap-x-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleGoToBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        )}

        {currentStep < totalSteps - 1 ? (
          <Button
            type="button"
            variant="default"
            onClick={handleGoToNext}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            type="button"
            variant="default"
            className="flex items-center gap-1"
            disabled={loading}
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Submit <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigationFooter;
