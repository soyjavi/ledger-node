import getRates from './modules/getRates';

export default async ({ props: { baseCurrency } }, res, next) => {
  const rates = await getRates(baseCurrency);
  const keys = Object.keys(rates);

  res.dataSource = keys.length > 0 ? rates[keys[keys.length - 1]] : {};

  next();
};
