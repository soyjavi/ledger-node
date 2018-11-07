import { ERROR } from '../common';

export default (req, res, next) => {
  const { routeMap } = req;

  req.props = Object.assign({}, req.params, req.query, req.body);

  if (routeMap && routeMap.required) {
    const props = Object.keys(req.props);
    const requiredParameters = routeMap.required.filter(x => !props.includes(x));

    if (requiredParameters.length > 0) return ERROR.REQUIRED_PARAMETERS(res, requiredParameters.join(', '));
  }

  return next();
};
