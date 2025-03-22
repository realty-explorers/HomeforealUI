import React from 'react';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import FormField from '@/components/FormField';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { OfferFormData } from '@/schemas/OfferDataSchemas';

const BuyerDetails: React.FC = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<OfferFormData>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="wizard-title">Buyer Information</div>
      <p className="wizard-subtitle">Enter the buyer's contact details</p>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1 space-y-4">
            <FormField
              id="buyerDetails.name"
              label="Full Name"
              required
              error={errors.buyerDetails?.name?.message}
            >
              <Input
                id="buyerDetails.name"
                placeholder="Enter full name"
                {...register('buyerDetails.name')}
                className={''}
              />
            </FormField>
            <FormField
              id="buyerDetails.address"
              label="Address"
              error={errors.buyerDetails?.address?.message as string}
            >
              <Input
                id="buyerDetails.address"
                placeholder="Enter address"
                {...register('buyerDetails.address')}
                className={errors.buyerDetails?.address ? 'border-red-500' : ''}
              />
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="buyerDetails.phone"
            label="Phone Number"
            error={errors.buyerDetails?.phone?.message as string}
          >
            <Input
              id="buyerDetails.phone"
              placeholder="Enter phone number"
              {...register('buyerDetails.phone')}
              className={errors.buyerDetails?.phone ? 'border-red-500' : ''}
            />
          </FormField>

          <FormField
            id="buyerDetails.email"
            label="Email Address"
            error={errors.buyerDetails?.email?.message as string}
          >
            <Input
              id="buyerDetails.email"
              type="email"
              placeholder="Enter email address"
              {...register('buyerDetails.email')}
              className={errors.buyerDetails?.email ? 'border-red-500' : ''}
            />
          </FormField>
        </div>
      </div>
    </motion.div>
  );
};

export default BuyerDetails;
