import React, { useState, useEffect, memo, useCallback } from 'react';
import { findDeals } from '../../api/deals_api';
import { Container, Col, Row } from 'react-bootstrap';
import { Form, Button, Input, Collapse, Select, Checkbox, Tree } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import SearchInputFields from '../formComponents/SearchInputFields';
import SearchNumericFields from '../formComponents/SearchNumericFields';
import SearchRangeNumericFields from '../formComponents/SearchRangeNumericFields';
import '../formComponents/form.scss';
import { useFetcher, useSubmit } from 'react-router-dom';

const formItemLayout = {
	labelCol: { span: 14 },
	wrapperCol: { span: 4 },
};

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

const searchInputValues = {
	zillowUrl: {
		title: 'ZillowUrl',
		rules: [{ required: true, message: 'Must include Zillow URL' }],
	},
	address: {
		title: 'Address',
		rules: [{ required: true, message: 'Must include Address' }],
	},
};

const priceFormatter = (value: number) =>
	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value}`;
const distanceFormatter = (value: number) => `${value} Miles`;
const ageFormatter = (value: number) => `${value} days`;

const searchRangeNumericValues = {
	price: {
		title: 'Price',
		min: 0,
		max: 10000000,
		step: 1000,
		formatter: priceFormatter,
	},
};
const searchNumericValues = {
	arv: {
		title: 'Arv',
		min: 0,
		max: 10000000,
		step: 100000,
		rules: [{ required: true, message: 'Must include ARV' }],
		formatter: priceFormatter,
	},
	underComps: {
		title: 'UnderComps',
		min: 0,
		max: 200,
		step: 1,
		rules: [{ required: true, message: 'Must include Under comps' }],
		formatter: percentFormatter,
	},
	radius: {
		title: 'Radius',
		min: 0,
		max: 100,
		step: 0.5,
		rules: [{ required: true, message: 'Must include radius' }],
		formatter: distanceFormatter,
	},
	age: {
		title: 'Age',
		min: 0,
		max: 120,
		step: 1,
		formatter: ageFormatter,
	},
};

type SearchSectionProps = {};

const SearchSection: React.FC<SearchSectionProps> = (
	props: SearchSectionProps
) => {
	const [form] = Form.useForm();
	const submit = useSubmit();
	const fetcher = useFetcher();

	const onFinish = async (values: any) => {
		try {
			// alert(JSON.stringify(values));
			// const response = await findDeals(
			// 	values['zillowUrl'],
			// 	values['radius'],
			// 	values['underComps'],
			// 	values['price'][0],
			// 	values['price'][1],
			// 	'6m'
			// );
			// if (response.status === 200) {
			// 	alert('done');
			// 	console.log(response.data);
			// } else throw Error(response.data);
		} catch (error) {
			alert(error);
		} finally {
		}
	};

	return (
		<Container className="search-form-wrapper">
			<Row>
				<Col>
					<Form
						{...layout}
						form={form}
						onFinish={onFinish}
						action="/results">
						<SearchInputFields searchValues={searchInputValues} />
						<SearchNumericFields
							searchValues={searchNumericValues}
							form={form}
						/>
						<SearchRangeNumericFields
							searchValues={searchRangeNumericValues}
							form={form}
						/>
						<Form.Item {...tailLayout}>
							<Button
								htmlType="submit"
								key="submit"
								type="primary">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default SearchSection;
