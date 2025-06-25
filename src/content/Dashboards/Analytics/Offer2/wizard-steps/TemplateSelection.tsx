import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import {
  useTemplateSelection,
  useTemplateSelectionContext
} from '@/contexts/OfferFormContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Home, MapPin, Plus, Trash2 } from 'lucide-react';
import { OfferFormData } from '@/schemas/OfferDataSchemas';
import { useSession } from 'next-auth/react';
import { selectProperties } from '@/store/slices/propertiesSlice';
import { useAppSelector } from '@/store/hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const TemplateCard = ({
  id,
  name,
  description,
  type,
  isSelected,
  onSelect,
  onDelete
}: {
  id: string | null;
  name: string;
  description: string;
  type: TemplateType;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (id: string) => void;
}) => {
  // Icon selection based on template type
  const getIcon = () => {
    switch (type) {
      case 'residential':
        return <Home className="h-6 w-6" />;
      case 'commercial':
        return <Building2 className="h-6 w-6" />;
      case 'vacant-land':
        return <MapPin className="h-6 w-6" />;
      default:
        return <Plus className="h-6 w-6" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected
            ? 'border-2 border-brand-main bg-brand-main/5'
            : 'hover:border-brand-light'
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {id !== null && id && onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div
                className={`p-2 rounded-full ${
                  isSelected ? 'bg-brand-main text-white' : 'bg-gray-100'
                }`}
              >
                {getIcon()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-2">
          <Button
            variant={isSelected ? 'default' : 'outline'}
            className="w-full"
            onClick={onSelect}
          >
            {isSelected ? 'Selected' : 'Use Template'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const TemplateSelection: React.FC = () => {
  const { data: session } = useSession();
  const { selectedPropertyPreview } = useAppSelector(selectProperties);
  const userFormData: Partial<OfferFormData> = {
    buyerDetails: {
      email: session?.user?.email || ''
    },
    financialDetails: {
      purchasePrice: selectedPropertyPreview?.price || 0,
      financingType: 'Cash'
    }
  };
  const methods = useFormContext<OfferFormData>();
  const { templates, selectedTemplateId, selectTemplate, deleteTemplate } =
    useTemplateSelectionContext();

  // Delete template functionality
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (templateToDelete) {
      try {
        const result = await deleteTemplate(templateToDelete);
        // Error handling is now done within the context using notistack
      } catch (error) {
        // Additional error handling if needed
      } finally {
        setIsDeleteDialogOpen(false);
        setTemplateToDelete(null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="wizard-title">Choose a Template</div>
      <p className="wizard-subtitle">
        Select a template to start with or create a custom offer
      </p>

      <ScrollArea className="h-[350px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              id={template._id}
              name={template.name}
              description={template.description}
              type={template.type}
              isSelected={selectedTemplateId === template._id}
              onSelect={() => selectTemplate(template._id, userFormData)}
              onDelete={handleDeleteTemplate}
            />
          ))}

          {/* Custom template option */}
          <TemplateCard
            id={null}
            name="Custom Offer"
            description="Start from scratch with a blank template"
            type="custom"
            isSelected={selectedTemplateId === null}
            onSelect={() => selectTemplate(null, userFormData)}
          />
          {selectedTemplateId}
        </div>
      </ScrollArea>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTemplate}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TemplateSelection;
