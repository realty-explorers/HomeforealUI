import BuyBox from '@/models/buybox';
import LocationSuggestion from '@/models/location_suggestions';
import { signOut } from 'next-auth/react';
import {
	BaseQueryApi,
	createApi,
	FetchArgs,
	fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';
import { getServerSession } from 'next-auth/next';

// Type definitions for backend multifamily buybox response
interface BackendRange {
	min?: number;
	max?: number;
}

interface BackendRankingWeights {
	rent_upside?: number;
	price_discount?: number;
	occupancy_upside?: number;
	market_growth?: number;
	risk_penalty?: number;
}

interface BackendStrategy {
	preset?: string;
	minimum_projected_outcome_type?: string;
	minimum_projected_outcome_value?: number;
	custom_weights?: BackendRankingWeights;
}

interface BackendFilters {
	asset_types?: string[];
	unit_count_range?: BackendRange;
	total_price_range?: BackendRange;
	price_per_unit_range?: BackendRange;
	year_built_range?: BackendRange;
	value_add_level?: string;
	occupancy_range?: BackendRange;
	minimum_rent_upside_pct?: number;
	cap_rate_range?: BackendRange;
	minimum_noi_per_unit?: number;
	expense_ratio_range?: BackendRange;
}

interface BackendLocation {
	state?: string;
	city?: string;
	country?: string;
}

interface BackendGeneral {
	note?: string;
}

interface BackendQualityGates {
	offering_memorandum?: string;
	rent_roll?: string;
	t12?: string;
}

interface BackendMultifamilyBuybox {
	id?: string;
	_id?: string;
	name?: string;
	filters?: BackendFilters;
	location?: BackendLocation;
	strategy?: BackendStrategy;
	general?: BackendGeneral;
	quality_gates?: BackendQualityGates;
	status?: string;
	isPublic?: boolean;
	ownerId?: string;
	createdAt?: string;
	updatedAt?: string;
	userAccess?: string;
	access?: Array<{ subject: string; level: string }>;
	parameters?: {
		strategy?: {
			strategyType?: string;
		};
	};
}

const baseUrl = process.env.NEXT_PUBLIC_BUYBOX_API_URL;
// const baseUrl = "http://localhost:8000/buybox";
const GENERAL_BUYBOX_ID = '3dbf8068-bfda-4422-af27-7597045dac6e';

const baseQuery = fetchBaseQuery({
	baseUrl,
	prepareHeaders: async (headers, { getState }) => {
		let token = (getState() as RootState).auth.token;
		const session = (getState() as RootState).auth.session;

		if (!token) {
			try {
				const request = await fetch('/api/protected');
				const data = await request.json();
				token = data.accessToken;
			} catch (e) {
				console.log(e);
			}
		}

		// If we have a token set in state, let's assume that we should be passing it.
		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}

		// Add organization_id header for backend services that need it
		// Try to get from session first, fallback to a default for development
		const orgId = session?.user?.organizationId || session?.user?.org_id || 'default-org';
		headers.set('X-Organization-Id', orgId);

		return headers;
	}
});

const baseQueryWithReauth = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: any
) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result?.error?.status === 403) {
		//TODO: fetch new accessToken using refresh token and update auth state and recall the api
	} else if (result?.error?.status === 401) {
		await signOut({
			redirect: true,
			callbackUrl: '/'
		});
		api.dispatch(logout());
	}
	return result;
};

const mapToMultifamilyDto = (body: any) => {
	const mf = body.multifamilyCriteria || {};
	const discovery = mf.discovery || {};

	return {
		name: body.name,
		ui: {},
		general: { note: body.description },
		location: {
			country: 'US',
			state: body.targetLocations?.[0]?.state || '',
			city: body.targetLocations?.[0]?.city || '',
		},
		filters: {
			asset_types: discovery.assetTypes || [],
			unit_count_range: { min: discovery.minUnits || 0, max: discovery.maxUnits || 9999 },
			total_price_range: { min: discovery.minAskingPrice || 0, max: discovery.maxAskingPrice || 999999999 },
			price_per_unit_range: { min: discovery.minPricePerUnit || 0, max: discovery.maxPricePerUnit || 9999999 },
			year_built_range: { min: discovery.minYearBuilt || 1800, max: discovery.maxYearBuilt || 2100 },
			value_add_level: discovery.renovationAppetite,
			occupancy_range: { min: discovery.minOccupancyPct || 0, max: discovery.maxOccupancyPct || 100 },
			minimum_rent_upside_pct: discovery.minRentUpsidePct,
			cap_rate_range: discovery.minCapRatePct ? { min: discovery.minCapRatePct, max: discovery.maxCapRatePct || 100 } : undefined,
			minimum_noi_per_unit: discovery.minNoiPerUnit,
			expense_ratio_range: discovery.minExpenseRatioPct ? { min: discovery.minExpenseRatioPct, max: discovery.maxExpenseRatioPct || 100 } : undefined,
		},
		strategy: {
			preset: discovery.rankingPreset || 'BALANCED',
			minimum_projected_outcome_type: discovery.minimumProjectedOutcomeType || 'yield',
			minimum_projected_outcome_value: discovery.minimumProjectedOutcomeValue || 6,
			custom_weights: discovery.rankingWeights ? {
				rent_upside: discovery.rankingWeights.upside || 0,
				price_discount: discovery.rankingWeights.discount || 0,
				occupancy_upside: discovery.rankingWeights.yield || 0,
				market_growth: discovery.rankingWeights.yield || 0,
				risk_penalty: discovery.rankingWeights.risk || 0,
			} : undefined,
		},
		quality_gates: discovery.dealQualityGates ? {
			offering_memorandum: discovery.dealQualityGates.requireOm,
			rent_roll: discovery.dealQualityGates.requireRentRoll,
			t12: discovery.dealQualityGates.requireT12,
		} : undefined,
	};
};

// Helper to convert backend asset type to frontend format
const convertAssetType = (type: string): string => {
	if (!type) return 'MULTIFAMILY_GARDEN';
	const normalized = type.toUpperCase();
	const legacyMap: Record<string, string> = {
		'MULTIFAMILY': 'MULTIFAMILY_GARDEN',
		'GARDEN_STYLE': 'MULTIFAMILY_GARDEN',
		'GARDEN': 'MULTIFAMILY_GARDEN',
		'MID_RISE': 'MULTIFAMILY_MIDRISE',
		'HIGH_RISE': 'MULTIFAMILY_HIGHRISE',
		'MIXED_USE': 'MIXED_USE_RESIDENTIAL',
		'STUDENT_HOUSING': 'STUDENT_HOUSING',
		'SENIOR_HOUSING': 'SENIOR_HOUSING'
	};
	return legacyMap[normalized] || normalized;
};

// Helper to convert backend value_add_level to frontend renovationAppetite
const convertValueAddLevel = (level: string): string => {
	if (!level) return 'MODERATE';
	const normalized = level.toUpperCase();
	const map: Record<string, string> = {
		'TURNKEY': 'LIGHT',
		'LIGHT_VALUE_ADD': 'MODERATE',
		'HEAVY_VALUE_ADD': 'HEAVY',
		'REPOSITION': 'REPOSITION',
		'LIGHT': 'LIGHT',
		'MODERATE': 'MODERATE',
		'HEAVY': 'HEAVY'
	};
	return map[normalized] || 'MODERATE';
};

// Helper to convert backend quality gate level to frontend format
const convertQualityGateLevel = (level: string): string => {
	if (!level) return 'OPTIONAL';
	const normalized = level.toUpperCase();
	const map: Record<string, string> = {
		'OPTIONAL': 'OPTIONAL',
		'PREFERRED': 'PREFERRED',
		'REQUIRED': 'REQUIRED'
	};
	return map[normalized] || 'OPTIONAL';
};

// Helper to convert backend preset to uppercase
const convertPreset = (preset: string): string => {
	if (!preset) return 'BALANCED';
	return preset.toUpperCase();
};

const mapFromMultifamilyDto = (buybox: BackendMultifamilyBuybox | BuyBox): BuyBox => {
	// Check if this is a backend multifamily buybox response (has filters/location/strategy at top level)
	// or already transformed buybox (has parameters)
	const typedBuybox = buybox as BackendMultifamilyBuybox;
	const isBackendMfFormat = typedBuybox.filters && typedBuybox.location && typedBuybox.strategy;
	const isAlreadyTransformed = (buybox as BuyBox).parameters?.strategy?.strategyType === 'MULTIFAMILY';

	if (!isBackendMfFormat && !isAlreadyTransformed) return buybox as BuyBox;

	// If already transformed, don't reprocess
	if (isAlreadyTransformed) return buybox as BuyBox;

	// Debug logging in development
	if (process.env.NODE_ENV === 'development') {
		console.log('[mapFromMultifamilyDto] Transforming backend buybox:', {
			id: typedBuybox.id,
			name: typedBuybox.name,
			location: typedBuybox.location,
			strategy: typedBuybox.strategy,
			filters: typedBuybox.filters
		});
	}

	// Validate critical fields
	if (!typedBuybox.location?.state) {
		console.warn('[mapFromMultifamilyDto] Missing location state for buybox:', typedBuybox.id);
	}

	// Convert asset types from backend format to frontend format
	const assetTypes = (typedBuybox.filters?.asset_types || []).map(convertAssetType);

	// Transform backend format to frontend format
	const parameters = {
		name: typedBuybox.name || '',
		description: typedBuybox.general?.note || '',
		strategy: {
			strategyType: 'MULTIFAMILY' as const,
			preset: convertPreset(typedBuybox.strategy?.preset) as 'CORE' | 'BALANCED' | 'CASH_FLOW' | 'VALUE_ADD' | 'OPPORTUNISTIC' | 'LOW_RISK' | 'DEEP_DISCOUNT' | 'CUSTOM' | undefined,
			primaryKpi: {
				type: (typedBuybox.strategy?.minimum_projected_outcome_type || 'yield') as 'yield' | 'cash_yield' | 'rent_upside' | 'irr' | 'value_gap' | undefined,
				mode: 'minimum' as const,
				minValue: typedBuybox.strategy?.minimum_projected_outcome_value,
				maxValue: undefined as number | undefined,
				hardGateEnabled: false
			},
			stressPreset: undefined as 'conservative' | 'base' | 'aggressive' | 'custom' | undefined
		},
		targetLocations: typedBuybox.location ? [{
			display: `${typedBuybox.location.city || ''}, ${typedBuybox.location.state || ''}`.trim().replace(/^,\s*|,\s*$/, ''),
			type: (typedBuybox.location.city ? 'city' : 'state') as 'city' | 'state',
			state: typedBuybox.location.state || '',
			city: typedBuybox.location.city || '',
		}] : [],
		multifamilyCriteria: {
			discovery: {
				assetTypes: (assetTypes.length > 0 ? assetTypes : ['MULTIFAMILY_GARDEN']) as ('MULTIFAMILY_GARDEN' | 'MULTIFAMILY_MIDRISE' | 'MULTIFAMILY_HIGHRISE' | 'MULTIFAMILY_SMALL' | 'MIXED_USE_RESIDENTIAL' | 'STUDENT_HOUSING' | 'SENIOR_HOUSING')[],
				renovationAppetite: convertValueAddLevel(typedBuybox.filters?.value_add_level) as 'LIGHT' | 'MODERATE' | 'HEAVY' | 'REPOSITION',
				minUnits: typedBuybox.filters?.unit_count_range?.min ?? 10,
				maxUnits: typedBuybox.filters?.unit_count_range?.max ?? 200,
				minAskingPrice: typedBuybox.filters?.total_price_range?.min ?? 0,
				maxAskingPrice: typedBuybox.filters?.total_price_range?.max ?? 20000000,
				minPricePerUnit: typedBuybox.filters?.price_per_unit_range?.min ?? 50000,
				maxPricePerUnit: typedBuybox.filters?.price_per_unit_range?.max ?? 350000,
				minYearBuilt: typedBuybox.filters?.year_built_range?.min ?? 1960,
				maxYearBuilt: typedBuybox.filters?.year_built_range?.max ?? new Date().getFullYear(),
				minOccupancyPct: typedBuybox.filters?.occupancy_range?.min ?? 70,
				maxOccupancyPct: typedBuybox.filters?.occupancy_range?.max ?? 95,
				minRentUpsidePct: typedBuybox.filters?.minimum_rent_upside_pct ?? 5,
				minCapRatePct: typedBuybox.filters?.cap_rate_range?.min ?? 4,
				maxCapRatePct: typedBuybox.filters?.cap_rate_range?.max ?? 10,
				minNoiPerUnit: typedBuybox.filters?.minimum_noi_per_unit ?? 0,
				minExpenseRatioPct: typedBuybox.filters?.expense_ratio_range?.min ?? 30,
				maxExpenseRatioPct: typedBuybox.filters?.expense_ratio_range?.max ?? 65,
				rankingPreset: convertPreset(typedBuybox.strategy?.preset) as 'CORE' | 'BALANCED' | 'CASH_FLOW' | 'VALUE_ADD' | 'OPPORTUNISTIC' | 'LOW_RISK' | 'DEEP_DISCOUNT' | 'CUSTOM' | undefined,
				minimumProjectedOutcomeType: (typedBuybox.strategy?.minimum_projected_outcome_type || 'yield') as 'yield' | 'cash_yield' | 'rent_upside' | 'irr' | 'value_gap',
				minimumProjectedOutcomeValue: typedBuybox.strategy?.minimum_projected_outcome_value ?? 6,
				rankingWeights: typedBuybox.strategy?.custom_weights ? {
					yield: typedBuybox.strategy.custom_weights.occupancy_upside ?? 25,
					upside: typedBuybox.strategy.custom_weights.rent_upside ?? 25,
					discount: typedBuybox.strategy.custom_weights.price_discount ?? 25,
					risk: typedBuybox.strategy.custom_weights.risk_penalty ?? 15,
					docs: 0,
				} : { yield: 25, upside: 25, discount: 25, risk: 15, docs: 10 },
				dealQualityGates: {
					requireOm: convertQualityGateLevel(typedBuybox.quality_gates?.offering_memorandum) as 'OPTIONAL' | 'PREFERRED' | 'REQUIRED',
					requireRentRoll: convertQualityGateLevel(typedBuybox.quality_gates?.rent_roll) as 'OPTIONAL' | 'PREFERRED' | 'REQUIRED',
					requireT12: convertQualityGateLevel(typedBuybox.quality_gates?.t12) as 'OPTIONAL' | 'PREFERRED' | 'REQUIRED',
				},
			},
			unitMix: [] as unknown[],
			rentRoll: {} as Record<string, unknown>,
			income: {} as Record<string, unknown>,
			expenses: {} as Record<string, unknown>,
			utilities: { utilityBillingType: 'OWNER_PAID' as const },
			stressTest: {} as Record<string, unknown>
		},
		propertyCriteria: {} as Record<string, unknown>,
		weights: {} as Record<string, number>
	};

	const transformedBuybox: BuyBox = {
		id: typedBuybox.id || typedBuybox._id || '',
		parameters,
		createdAt: typedBuybox.createdAt ? new Date(typedBuybox.createdAt) : new Date(),
		updatedAt: typedBuybox.updatedAt ? new Date(typedBuybox.updatedAt) : new Date(),
		userAccess: typedBuybox.userAccess || 'owner',
		access: typedBuybox.access || [{ subject: 'user', level: 'owner' }]
	};

	if (process.env.NODE_ENV === 'development') {
		console.log('[mapFromMultifamilyDto] Transformed buybox:', transformedBuybox);
	}

	return transformedBuybox;
};

export const buyBoxApi = createApi({
	reducerPath: 'buyboxApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['BuyBox'],
	endpoints: (builder) => ({
		getBuyBoxes: builder.query<BuyBox[], any>({
			query: () => ({ url: '/v1/buybox' }),
			transformResponse: (response: any) => response.map(mapFromMultifamilyDto),
			extraOptions: {
				fixedCacheKey: 'sharedBuyBoxesData'
			},
			providesTags: ['BuyBox']
		}),
		createBuyBox: builder.mutation({
			query: (body) => {
				const isMf = body.strategy?.strategyType === 'MULTIFAMILY';
				return {
					url: isMf ? '/v1/mf/buyboxes' : '/v1/buybox',
					method: 'POST',
					body: isMf ? mapToMultifamilyDto(body) : { parameters: body }
				};
			},
			transformResponse: (response: any) => response,
			invalidatesTags: ['BuyBox']
		}),
		updateBuyBox: builder.mutation({
			query: ({ id, parameters }) => {
				const isMf = parameters.strategy?.strategyType === 'MULTIFAMILY';
				return {
					url: isMf ? `/v1/mf/buyboxes/${id}` : `/v1/buybox/${id}`,
					method: 'PUT',
					body: isMf ? mapToMultifamilyDto(parameters) : { parameters }
				};
			},
			transformResponse: (response: any) => mapFromMultifamilyDto(response),
			// async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
			//   const patchResult = dispatch(
			//     buyBoxApi.util.updateQueryData(
			//       "getBuyBoxes",
			//       "1",
			//       (draftBuyBoxes) => {
			//         const draft = draftBuyBoxes.find((buyBox) => buyBox.id === id);
			//         if (draft) {
			//           Object.assign(draft, {
			//             ...patch,
			//           });
			//         }
			//       },
			//     ),
			//   );
			//
			//   try {
			//     await queryFulfilled;
			//   } catch {
			//     patchResult.undo();
			//   }
			//   // queryFulfilled.catch(patchResult.undo);
			// },
			// invalidatesTags: (
			//   result,
			//   error,
			//   arg,
			// ) => [{ type: "BuyBox", id: arg.id }],
			invalidatesTags: ['BuyBox']
		}),
		deleteBuyBox: builder.mutation({
			query: ({ id, isMultifamily }) => ({
				url: isMultifamily ? `/v1/mf/buyboxes/${id}` : `/v1/buybox/${id}`,
				method: 'DELETE'
			}),
			transformResponse: (response: any) => response,
			invalidatesTags: ['BuyBox']
		}),
		validateBuyBox: builder.mutation({
			query: (id) => ({
				url: `/v1/mf/buyboxes/${id}/validate`,
				method: 'POST'
			})
		}),
		finalizeBuyBox: builder.mutation({
			query: (id) => ({
				url: `/v1/mf/buyboxes/${id}/finalize`,
				method: 'POST'
			}),
			invalidatesTags: ['BuyBox']
		}),

		getLeads: builder.query({
			query: () => ({ url: `leads/${GENERAL_BUYBOX_ID}` }),
			transformResponse: (response: any) => response
		})
	})
});

export const buyBoxApiEndpoints = buyBoxApi.endpoints;

export const {
	useGetBuyBoxesQuery,
	useLazyGetBuyBoxesQuery,
	useCreateBuyBoxMutation,
	useUpdateBuyBoxMutation,
	useDeleteBuyBoxMutation,
	useValidateBuyBoxMutation,
	useFinalizeBuyBoxMutation
} = buyBoxApi;
