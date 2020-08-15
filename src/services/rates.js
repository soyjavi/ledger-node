import getRates from "./modules/getRates";

export const rates = async ({ props: { baseCurrency } }, res, next) => {
  res.dataSource = await getRates(baseCurrency);

  next();
};
