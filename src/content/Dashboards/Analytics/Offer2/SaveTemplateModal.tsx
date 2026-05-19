import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTemplateSelectionContext } from '@/contexts/OfferFormContext';

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveTemplateModal = ({ open, onOpenChange }: SaveTemplateModalProps) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const { saveTemplate, selectedTemplate, selectedTemplateId } =
    useTemplateSelectionContext();

  // Prefill form if editing an existing template
  useEffect(() => {
    if (open && selectedTemplate) {
      setTemplateName(selectedTemplate.name || '');
      setTemplateDescription(selectedTemplate.description || '');
    } else if (open && !selectedTemplate) {
      // Reset form when opening for a new template
      setTemplateName('');
      setTemplateDescription('');
    }
  }, [open, selectedTemplate]);

  const handleSave = async () => {
    if (templateName.trim()) {
      try {
        setIsSaving(true);
        setSaveError('');

        // Pass the selectedTemplateId if we're updating an existing template
        const result = await saveTemplate(
          templateName.trim(),
          templateDescription.trim(),
          selectedTemplate?.name
        );

        if (result.success) {
          onOpenChange(false);
          setTemplateName('');
          setTemplateDescription('');
        } else {
          if (result.error?.status === 409) {
            setSaveError(
              'You have reached the maximum number of templates allowed. Please delete an existing template before saving a new one.'
            );
          } else {
            setSaveError(
              `Failed to ${
                selectedTemplateId ? 'update' : 'save'
              } template. Please try again later`
            );
          }
        }
      } catch (error) {
        // Error handling is done within the context using notistack
        if (error?.status === 409) {
          // max templates reached
          setSaveError(
            `You have reached the maximum number of templates allowed. Please delete an existing template before saving a new one.`
          );
        } else {
          setSaveError('An unexpected error occurred.');
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedTemplateId ? 'Update Template' : 'Save Template'}
          </DialogTitle>
          <DialogDescription>
            {selectedTemplateId}
            {selectedTemplateId
              ? 'Update your template with the current configuration.'
              : 'Save your current configuration as a template for future use.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="template-name" className="font-medium">
              Template Name*
            </Label>
            <Input
              id="template-name"
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="template-description" className="font-medium">
              Description (optional)
            </Label>
            <Textarea
              id="template-description"
              placeholder="Enter description"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="col-span-3 min-h-[80px]"
            />
          </div>
        </div>
        {saveError && (
          <div className="text-red-500 text-sm mt-2">{saveError}</div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!templateName.trim() || isSaving}
          >
            {isSaving && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
            {selectedTemplateId ? 'Update Template' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateModal;
