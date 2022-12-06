import React, { useState, useEffect, memo, useCallback } from 'react';
import { Form, Checkbox, Input, Slider, InputNumber, FormInstance } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { findAllInRenderedTree } from 'react-dom/test-utils';

type SearchRangeNumericValues = {
	[key: string]: {
		min: number;
		max: number;
		step: number;
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

type SearchRangeNumericFieldsProps = {
	form: FormInstance;
	searchValues: SearchRangeNumericValues | any;
};

const SearchRangeNumericFields: React.FC<SearchRangeNumericFieldsProps> = (
	props: SearchRangeNumericFieldsProps
) => {
	const [inputValue, setInputValue] = useState<[number, number]>([0, 0]);

	const onChange = (value: [number, number], key: string) => {
		console.log(value);
		setInputValue(value);
		props.form.setFieldValue(key, value);
	};

	const onChangeRangeValue = (newValue: any, key: string, min: boolean) => {
		let value = inputValue;
		if (min) value = [newValue, inputValue[1]];
		else value = [inputValue[0], newValue];
		setInputValue(value);
		props.form.setFieldValue(key, value);
	};

	const getValue = (key: string) => {
		return inputValue;
	};

	const getRangeValue = (key: string, min: boolean) => {
		const valueIndex = min ? 0 : 1;
		return inputValue[valueIndex];
	};
	// const meow = (value?: number) => props.searchValues[key].formatter;

	return (
		props.searchValues &&
		Object.keys(props.searchValues).map((key, index) => {
			return (
				<>
					<Form.Item
						name={`${key}`}
						label={`${props.searchValues[key].title}`}
						key={index}
						htmlFor={`${key}`}>
						<Row className="center-row">
							<Col className="input-slider">
								<Slider
									min={props.searchValues[key].min}
									max={props.searchValues[key].max}
									step={props.searchValues[key].step}
									range
									onChange={(value) => onChange(value, key)}
									value={getValue(key)}
									tooltip={{
										formatter:
											props.searchValues[key].formatter,
									}}
								/>
							</Col>
							<Form.Item>
								<Col>
									<InputNumber
										className="number-input"
										formatter={
											props.searchValues[key].formatter
										}
										// parser={props.searchValues[key].parser}
										min={props.searchValues[key].min}
										max={props.searchValues[key].max}
										step={props.searchValues[key].step}
										style={{
											margin: '0 1em',
											width: '10em',
										}}
										value={getRangeValue(key, true)}
										onChange={(value) =>
											onChangeRangeValue(
												value || 0,
												key,
												true
											)
										}
									/>
								</Col>
								<Col>
									<span>-</span>
								</Col>

								<Col>
									<InputNumber
										className="number-input"
										formatter={
											props.searchValues[key].formatter
										}
										// parser={props.searchValues[key].parser}
										min={props.searchValues[key].min}
										max={props.searchValues[key].max}
										step={props.searchValues[key].step}
										style={{ margin: '0', width: '10em' }}
										value={getRangeValue(key, false)}
										onChange={(value) =>
											onChangeRangeValue(
												value || 0,
												key,
												false
											)
										}
									/>
								</Col>
							</Form.Item>
						</Row>
					</Form.Item>
				</>
			);
		})
	);
};

export default SearchRangeNumericFields;
