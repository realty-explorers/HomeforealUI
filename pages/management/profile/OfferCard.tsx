import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Home,
  Bath,
  BedDouble,
  SquareStack,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardEdit,
  DollarSign,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import FullOffer from 'types/offers/full-offer';

interface OfferCardProps {
  offer: FullOffer;
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const propertyDetails = offer?.propertyDetails;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
      case 'IN_REVIEW':
      default:
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'REJECTED':
        return <XCircle className="h-3 w-3" />;
      case 'EXPIRED':
        return <Clock className="h-3 w-3" />;
      case 'IN_REVIEW':
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatAddress = (location: any) => {
    if (!location) return 'Address not available';
    return `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`;
  };

  return (
    offer && (
      <Card
        className={cn(
          'overflow-hidden card-hover h-full',
          'transition-all duration-500 ease-out'
        )}
      >
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img
              src={propertyDetails.photos.primary}
              alt={formatAddress(propertyDetails.location)}
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />
          </div>

          <div className="absolute top-3 right-3">
            <Badge className={cn('font-medium', getStatusColor(offer.status))}>
              <span className="flex items-center gap-1">
                {getStatusIcon(offer.status)}
                <span className="capitalize">
                  {offer.status.replace('_', ' ')}
                </span>
              </span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-xl text-balance leading-tight">
                  {formatCurrency(
                    offer.offerData.financialDetails.purchasePrice
                  )}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-realEstate-50 text-realEstate border-realEstate-100"
                >
                  {propertyDetails.type.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                {formatAddress(propertyDetails.location)}
              </p>
            </div>

            <div className="flex justify-between text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Offered: {formatDate(offer.createdAt)}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <Info className="h-3.5 w-3.5" />
                      <span>
                        {offer.offerData.financialDetails.financingType}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Financing Type:{' '}
                      {offer.offerData.financialDetails.financingType}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator />

            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <BedDouble className="h-4 w-4 text-realEstate-400" />
                <span className="text-sm">{propertyDetails.beds} bd</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4 text-realEstate-400" />
                <span className="text-sm">{propertyDetails.baths} ba</span>
              </div>
              <div className="flex items-center gap-1">
                <SquareStack className="h-4 w-4 text-realEstate-400" />
                <span className="text-sm">
                  {propertyDetails.area.toLocaleString()} sqft
                </span>
              </div>
            </div>

            <div className="px-3 py-2 bg-muted rounded-md text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Year Built:</span>
                <span className="font-medium">{propertyDetails.yearBuilt}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Buyer:</span>
                <span className="font-medium">
                  {offer.offerData.buyerDetails.name || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Inspection:</span>
                <span className="font-medium">
                  {offer.offerData.propertyTerms.conductInspection
                    ? 'Required'
                    : 'Waived'}
                </span>
              </div>
            </div>

            {propertyDetails.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {propertyDetails.description}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex justify-between gap-2">
          <Button variant="secondary" className="w-full gap-1">
            <Home className="h-4 w-4" />
            <span>View Offer Details</span>
          </Button>
        </CardFooter>
      </Card>
    )
  );
};

export default OfferCard;
