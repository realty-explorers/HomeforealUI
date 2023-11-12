interface FormRangeField {
  label: string;
  fieldName: string;
  subjectFieldName?: string;
  formatLabelAsNumber?: boolean;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  postfix?: string;
}

export default FormRangeField;
