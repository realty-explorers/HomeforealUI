import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLazyGetOffersQuery } from '@/store/services/offersApi';
import { useSession } from 'next-auth/react';
import { Offer } from '@/schemas/OfferSchemas';

/**
 * Hook that provides a function to check if a property has an offer
 * and maintains a map of propertyId -> offerId for quick lookups
 */
export const usePropertyOffers = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [getOffers, { data: offers, isLoading, isSuccess }] =
    useLazyGetOffersQuery();
  const fetchedRef = useRef(false);

  // Auto-fetch offers once when the hook is initialized and user ID is available
  useEffect(() => {
    if (userId && !fetchedRef.current && !isSuccess && !isLoading) {
      fetchedRef.current = true;
      getOffers({ userId }, true); // Using the second parameter (true) to prefer cached data
    }
  }, [userId, getOffers, isSuccess, isLoading]);

  // Manual fetch function (used only when needed for refreshing data)
  const fetchOffers = useCallback(() => {
    if (userId) {
      getOffers({ userId }, true); // Using the second parameter (true) to prefer cached data
    }
  }, [userId, getOffers]);

  // Create an efficient lookup map: propertyId -> offerId
  const propertyOfferMap = useMemo(() => {
    if (!offers?.offers) return new Map();

    const map = new Map();
    offers?.offers?.forEach((offer) => {
      if (offer.propertyId) {
        map.set(offer.propertyId, offer._id);
      }
    });
    return map;
  }, [offers]);

  // Function to check if a property has an offer
  const hasOffer = useCallback(
    (propertyId: string) => {
      return propertyId && propertyOfferMap.has(propertyId);
    },
    [propertyOfferMap]
  );

  // Function to get the offer id for a property
  const getOfferId = useCallback(
    (propertyId: string) => {
      return propertyOfferMap.get(propertyId);
    },
    [propertyOfferMap]
  );

  return {
    fetchOffers,
    hasOffer,
    getOfferId,
    offers
  };
};
