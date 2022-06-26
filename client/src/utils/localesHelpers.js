import { get } from 'lodash';
import locales from '../locales';

const getText = (key, obj) => {
  let text = get(locales, key, key);

  const keys = Object.keys(obj || {});

  if (keys.length > 0) {
    keys.forEach((key) => {
      text = text.replace(new RegExp(`\{\{${key}\}\}`, 'ig'), obj[key]);
    });
  }

  return text;
};

function capitalize(headerLabel) {
  return headerLabel ? headerLabel[0].toUpperCase() + headerLabel.slice(1).toLowerCase() : headerLabel;
}

function search(str, pattern) {
  if (!str || !pattern) {
    return -1;
  }
  const pattern2use = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return str.search(new RegExp(pattern2use, 'i'));
}

function isZeroConditionExluded(value) {
  return value != null && value != undefined && value !== '';
}

export { getText, capitalize, search, isZeroConditionExluded };
