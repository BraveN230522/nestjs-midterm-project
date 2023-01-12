import _ from 'lodash';
import { ObjectAny } from '../interfaces';

export const assignIfHasKey = (assignedObj: ObjectAny, obj: ObjectAny) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (key) assignedObj[key] = value;
  });
};

export const myMapOmit = <T>(data: T[] | any, toOmit: string[]) => {
  return _.compact(_.map(data, (item) => (item ? _.omit(item, toOmit) : null)));
};

export const myMapPick = <T>(data: T[], toPick: string[]) => {
  return _.compact(_.map(data, (item) => (item ? _.pick(item, toPick) : null)));
};
