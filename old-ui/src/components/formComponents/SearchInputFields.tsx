import React, { useState, useEffect, memo, useCallback } from 'react';
import { Form, Checkbox, Input } from 'antd';

type SearchInputFieldsProps = {
	searchValues: searchInputValues | any;
};

type searchInputValues = {
	[key: string]: {
		rules?: any;
	};
};

const SearchInputFields: React.FC<SearchInputFieldsProps> = (
	props: SearchInputFieldsProps
) => {
	return (
		props.searchValues &&
		Object.keys(props.searchValues).map((key, index) => {
			return (
				<Form.Item
					label={`${props.searchValues[key].title}`}
					key={index}
					name={`${key}`}
					rules={props.searchValues[key].rules}
					htmlFor={`${key}`}>
					<Input id={`${key}`} />
				</Form.Item>
			);
		})
	);
};

export default SearchInputFields;
