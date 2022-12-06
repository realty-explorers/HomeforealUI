import React, { useState, useEffect, memo, useCallback } from 'react';
import { Form, Checkbox, Input, Slider, InputNumber, FormInstance } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';

type searchNumericValues = {
	[key: string]: {
		title: string;
		min: number;
		max: number;
		step: number;
		rules?: any;
		formatter?: (
			value: number | undefined,
			info: {
				userTyping: boolean;
				input: string;
			}
		) => string;
		parser?: (displayValue: string | undefined) => any;
	};
};

type SearchNumericFieldsProps = {
	form: FormInstance;
	searchValues: searchNumericValues | any;
};

const SearchNumericFields: React.FC<SearchNumericFieldsProps> = (
	props: SearchNumericFieldsProps
) => {
	const [inputValues, setInputValue] = useState(1);

	const onChange = (value: number, key: string) => {
		setInputValue(value);
		props.form.setFieldValue(key, value);
	};

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
					<Row className="center-row">
						<Col className="input-slider">
							<Slider
								min={props.searchValues[key].min}
								max={props.searchValues[key].max}
								step={props.searchValues[key].step}
								onChange={(value) => onChange(value, key)}
								value={
									props.form.getFieldValue(key) ||
									props.searchValues[key].min
								}
								tooltip={{
									formatter:
										props.searchValues[key].formatter,
								}}
							/>
						</Col>
						<Col>
							<InputNumber
								className="number-input"
								formatter={props.searchValues[key].formatter}
								parser={props.searchValues[key].parser}
								min={props.searchValues[key].min}
								max={props.searchValues[key].max}
								step={props.searchValues[key].step}
								style={{ margin: '0 16px' }}
								value={
									props.form.getFieldValue(key) ||
									props.searchValues[key].min
								}
								onChange={(value) => onChange(value || 0, key)}
							/>
						</Col>
					</Row>
				</Form.Item>
			);
		})
	);
};

export default SearchNumericFields;
