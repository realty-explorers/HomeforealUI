
const priceFormatter = (value: number) =>
    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const percentFormatter = (value: number) => `%${value.toFixed(2)}`;

export { priceFormatter, percentFormatter };