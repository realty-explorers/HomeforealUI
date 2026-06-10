import { Button } from '@/components/ui/button';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  Save
} from 'lucide-react';
import { useState } from 'react';
import SaveTemplateModal from './SaveTemplateModal';

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
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);
  
  // Save template handling is now in the context
  return (
    <>
      <SaveTemplateModal 
        open={saveTemplateModalOpen} 
        onOpenChange={setSaveTemplateModalOpen}
      />
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 gap-x-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span>
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
              <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
            </Button>
          )}

          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              variant="default"
              onClick={handleGoToNext}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setSaveTemplateModalOpen(true)}
                type="button"
                variant="outline"
                className="flex items-center gap-1"
                disabled={loading}
              >
                <Save className="h-5 w-5" />
                <span className="hidden sm:inline">Save Template</span>
              </Button>
              <Button
                onClick={handleSubmit}
                type="button"
                variant="default"
                className="flex items-center gap-1"
                disabled={loading}
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                <span className="hidden sm:inline">Submit</span> <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WizardNavigationFooter;
