interface FormRangeField {
  label: string;
  fieldName: string;
  subjectFieldName?: string;
  valueFormat?: (value: any) => any;
  formatLabelAsNumber?: boolean;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  postfix?: string;
}

export default FormRangeField;
