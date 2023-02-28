import { findDeals } from "@/api/deals_api";
import { selectSearchData, setSearchResults } from "@/store/searchSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type SearchHook = {
	// search: () => {};
};

export const useSearch = () => {

	const [searching, setSearching] = useState<boolean>(false);;

	// const searchData = useSelector(selectSearchData);
	const dispatch = useDispatch();

	const search = async (searchData: any) => {
		try {
			setSearching(true);
			const response = await findDeals(
				searchData.distance,
				searchData.underComps,
				parseInt(searchData.minArv),
				parseInt(searchData.maxArv),
				parseInt(searchData.minPrice),
				parseInt(searchData.maxPrice)
			);
			if (response.status === 200) {
				dispatch(setSearchResults(response.data));
			} else throw Error(response.data);
		} catch (error) {
			console.log(JSON.stringify(error));
			alert(JSON.stringify(error));
		} finally {
			setSearching(false);
		}
	};

	// toggler name must be the field's name

	return {
		searching,
		search
	};
};

export default useSearch;
