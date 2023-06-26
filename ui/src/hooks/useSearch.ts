import { findDeals, findProperties } from "@/api/deals_api";
import { getLocationData } from "@/api/location_api";
import Property from "@/models/property";
import { SearchData, selectSearchData, setSearchAnalyzedProperty, setSearchLocationData, setSearchResults } from "@/store/searchSlice";
import { add } from "date-fns";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type SearchHook = {
	// search: () => {};
};

export const useSearch = () => {

	const [searching, setSearching] = useState<boolean>(false);;

	const searchDataGlobal = useSelector(selectSearchData);


	// const searchData = useSelector(selectSearchData);
	const dispatch = useDispatch();

	const searchDeals = async (searchData: SearchData, updatedProperty?: Property) => {
		try {
			setSearching(true);
			const response = await findDeals(
				searchData.location.metaData.regionId,
				searchData.distance,
				searchData.underComps,
				parseInt(searchData.minArv),
				parseInt(searchData.maxArv),
				parseInt(searchData.minPrice),
				parseInt(searchData.maxPrice),
				searchData.forSaleAge,
				searchData.soldAge,
				searchData.minSoldArea,
				searchData.maxSoldArea,
				searchData.minForSaleArea,
				searchData.maxForSaleArea,
				searchData.minBeds,
				searchData.maxBeds,
				searchData.minBaths,
				searchData.maxBaths,
				searchData.propertyTypes,
				updatedProperty
			);
			if (response.status === 200) {
				dispatch(setSearchResults(response.data));
			} else if (response.status === 401) {
				alert("You are not logged in!");
			} else throw Error(response.data);
		} catch (error) {
			console.log(JSON.stringify(error));
			if (!searchData.location.metaData) {
				alert("No selected location!");
			}
			else alert(error);
		} finally {
			setSearching(false);
		}
	};

	const searchProperties = async (searchData: SearchData) => {
		try {
			setSearching(true);
			dispatch(setSearchAnalyzedProperty(null));
			let areaType = '';
			if (searchData.location.resultType === 'Address') {
				areaType = 'address';
			} else if (searchData.location.resultType === 'Region') {
				areaType = searchData.location.metaData.regionType;
			}
			const propertiesResponse = await findProperties(
				searchData.location.display,
				areaType,
				searchData.location.metaData.city,
				searchData.location.metaData.state
			);
			const locationResponse = await getLocationData(
				searchData.location.display,
				areaType,
				searchData.location.metaData.city,
				searchData.location.metaData.state
			);
			if (propertiesResponse.status === 200 && locationResponse.status === 200) {
				dispatch(setSearchLocationData(locationResponse.data));
				if (areaType === 'address') dispatch(setSearchAnalyzedProperty(propertiesResponse.data[0]));
				// console.log(JSON.stringify(searchData.location))
				// searchDeals({ ...searchDataGlobal, location: searchData.location }, addressPrice);
				// alert('Search Finished')
			} else throw Error(propertiesResponse.data);
		} catch (error) {
			console.log(error);
			alert(error);
		} finally {
			setSearching(false);
		}
	};

	// toggler name must be the field's name

	return {
		searching,
		searchDeals,
		searchProperties
	};
};

export default useSearch;
