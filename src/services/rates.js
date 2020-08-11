import getRates from "./modules/getRates";

export default async ({ props: { baseCurrency } }, res, next) => {
  res.dataSource = await getRates(baseCurrency);

  next();
};
