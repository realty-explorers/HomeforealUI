import FormField from '@/components/FormField';
import HelperIcon from '@/components/HelperIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';

interface ConditionalFieldProps {
  control: any;
  setValue: any;
  watch: any;
  register: any;
  errors: any;
  mainField: {
    name: string;
    label: string;
    description: string;
    helperText?: string;
  };
  conditionalFields: {
    component: ReactNode;
    resetField: () => void;
  }[];
}
const ConditionalField = ({
  control,
  setValue,
  watch,
  register,
  errors,
  mainField,
  conditionalFields
}: ConditionalFieldProps) => {
  return (
    <Controller
      name={mainField.name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col items-center justify-between rounded-lg border p-4 shadow-sm gap-y-8 my-4">
          <div className="flex flex-col items-center justify-between w-full">
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-x-2">
                  <Label htmlFor="subjectProperty">{mainField.label}</Label>
                  {mainField.helperText && (
                    <HelperIcon helperText={mainField.helperText} />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {mainField.description}
                </p>
              </div>

              <Switch
                id={mainField.name}
                checked={field.value}
                onCheckedChange={() => {
                  field.onChange(!field.value);
                  if (!field.value) {
                    for (const conditional of conditionalFields) {
                      conditional.resetField();
                    }
                  }
                }}
              />
            </div>

            {watch(mainField.name) &&
              conditionalFields.map((conditionalField, index) => (
                <div key={index} className="w-full mt-4">
                  {conditionalField.component}
                </div>
              ))}
          </div>
        </div>
      )}
    />
  );
};

export default ConditionalField;
