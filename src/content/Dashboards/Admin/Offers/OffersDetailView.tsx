import React from 'react';
import { format } from 'date-fns';
import { Offer, OfferStatus } from '@/schemas/OfferSchemas';
import DetailModal from '../DetailsModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from './OfferStatusBadge';
import { Separator } from '@/components/ui/separator';
import { Check, Loader2, X } from 'lucide-react';
import { formatCurrency } from '@/utils/converters';
import {
  useApproveOfferMutation,
  useDeleteOfferMutation
} from '@/store/services/offersApi';

interface OfferDetailViewProps {
  offer: Offer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OfferDetailView: React.FC<OfferDetailViewProps> = ({
  offer,
  open,
  onOpenChange
}) => {
  const [deleteOffer, deleteOfferState] = useDeleteOfferMutation();
  const [approveOffer, approveOfferState] = useApproveOfferMutation();

  const handleStatusChange = async (
    offerId: string,
    newStatus: OfferStatus
  ) => {
    await approveOffer({ offerId });
    onOpenChange(false);
    // setPendingStatusChange({ offerId, status: newStatus });
    // setConfirmDialogOpen(true);
  };

  const handleDeleteOffer = async (offerId: string) => {
    await deleteOffer({ offerId });
    onOpenChange(false);
  };

  return (
    <DetailModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Offer Details: ${offer.id}`}
      description="View and manage all details for this offer"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Status</div>
            <div className="mt-1">
              <StatusBadge status={offer.status || 'PENDING'} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {offer.status === 'PENDING' && (
              <Button
                onClick={() => handleStatusChange(offer.id, 'ACCEPTED')}
                className="hover-scale"
              >
                {approveOfferState.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve Offer
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => handleDeleteOffer(offer.id)}
              className="hover-scale"
            >
              {deleteOfferState.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Delete Offer
            </Button>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="details">Offer Details</TabsTrigger>
            <TabsTrigger value="buyer">Buyer Information</TabsTrigger>
            <TabsTrigger value="property">Property Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Financial Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Purchase Price
                    </div>
                    <div className="font-medium">
                      {formatCurrency(
                        offer.offerData.financialDetails.purchasePrice
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Financing Type
                    </div>
                    <div className="font-medium">
                      {offer.offerData.financialDetails.financingType}
                    </div>
                  </div>
                  {offer.offerData.financialDetails.loanAmount && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Loan Amount
                      </div>
                      <div className="font-medium">
                        {formatCurrency(
                          offer.offerData.financialDetails.loanAmount
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Deposit Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Deposit Amount
                    </div>
                    <div className="font-medium">
                      {formatCurrency(offer.offerData.deposit.depositAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Holder Name
                    </div>
                    <div className="font-medium">
                      {offer.offerData.deposit.holderName}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">
                      Holder Address
                    </div>
                    <div className="font-medium">
                      {offer.offerData.deposit.holderAddress}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Closing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {offer.offerData.closingDetails.closingDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Closing Date
                    </div>
                    <div className="font-medium">
                      {format(
                        new Date(offer.offerData.closingDetails.closingDate),
                        'MMM dd, yyyy'
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">
                    Possession on Closing
                  </div>
                  <div className="font-medium">
                    {offer.offerData.closingDetails.possesionOnClosing
                      ? 'Yes'
                      : 'No'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Option to Terminate
                  </div>
                  <div className="font-medium">
                    {offer.offerData.closingDetails.optionToTerminate
                      ? 'Yes'
                      : 'No'}
                  </div>
                </div>
              </div>

              {offer.offerData.closingDetails.additionalClause && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Additional Clause
                  </div>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    {offer.offerData.closingDetails.additionalClause}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="buyer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {offer.offerData.buyerDetails.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">
                      {offer.offerData.buyerDetails.email}
                    </div>
                  </div>
                  {offer.offerData.buyerDetails.phone && (
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">
                        {offer.offerData.buyerDetails.phone}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div className="font-medium">
                      {offer.offerData.buyerDetails.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="property" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Property Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Property ID
                    </div>
                    <div className="font-medium">{offer.propertyId}</div>
                  </div>

                  {offer.offerData?.legalDescription?.description && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Legal Description
                      </div>
                      <div className="font-medium">
                        {offer.offerData.legalDescription.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Property Terms</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Inspection Required
                    </div>
                    <div className="font-medium">
                      {offer.offerData.propertyTerms.conductInspection
                        ? 'Yes'
                        : 'No'}
                    </div>
                  </div>

                  {offer.offerData.propertyTerms.isInspectionContingent !==
                    undefined && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Inspection Contingent
                      </div>
                      <div className="font-medium">
                        {offer.offerData.propertyTerms.isInspectionContingent
                          ? 'Yes'
                          : 'No'}
                      </div>
                    </div>
                  )}

                  {offer.offerData.propertyTerms.inspectionDurationDays !==
                    undefined && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Inspection Period
                      </div>
                      <div className="font-medium">
                        {offer.offerData.propertyTerms.inspectionDurationDays}{' '}
                        days
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-muted-foreground">Lease</div>
                    <div className="font-medium">
                      {offer.offerData.propertyTerms.lease ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Offer Timeline</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Offer Created</div>
                    {/* <div className="text-sm text-muted-foreground"> */}
                    {/*   {offer.createdAt */}
                    {/*     ? format(offer.createdAt, 'MMMM dd, yyyy') */}
                    {/*     : 'Date unavailable'} */}
                    {/* </div> */}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-4 w-4 text-blue-600 font-bold">!</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Current Status: <StatusBadge status={offer.status} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: Unknown (not tracked in the system)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DetailModal>
  );
};

export default OfferDetailView;
