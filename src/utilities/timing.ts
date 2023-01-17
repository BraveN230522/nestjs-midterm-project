import _ from 'lodash';
import moment from 'moment';

export const datesToISOString = (...dates) => {
  const data = _.flatMap(dates);
  return _.map(data, (date) => moment(date, 'YYYY-MM-DD').toISOString());
};
