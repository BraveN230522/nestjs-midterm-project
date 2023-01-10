import { ObjectAny } from '../interfaces';

export const assignIfHasKey = (assignedObj: ObjectAny, obj: ObjectAny) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (key) assignedObj[key] = value;
  });
};
