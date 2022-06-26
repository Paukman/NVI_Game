export const createInputStandardAttrs = (props) => {
  const { id, name, dataEl } = props;
  const attrs = {};

  if (id) {
    attrs['id'] = id;
  }

  if (name) {
    attrs['name'] = name;
  }

  if (dataEl) {
    attrs['data-el'] = dataEl;
  }

  return attrs;
};

export const buildAttributes = (props, arrAllowedAttrs) => {
  const attrs = {};

  if (!Array.isArray(arrAllowedAttrs)) {
    arrAllowedAttrs = ['id', 'data-el', 'dataEl'];
  }

  Object.keys(props).forEach((prop) => {
    if (arrAllowedAttrs.indexOf(prop) !== -1) {
      const key = prop === 'dataEl' ? 'data-el' : prop;
      attrs[key] = props[prop];
    }
  });

  return attrs;
};

export const handleInputChange = (props) => (event) => {
  const { id, name, onChange } = props;
  if (typeof onChange === 'function') {
    let value = event;
    if (event && event.target) {
      value =
        ['checkbox'].indexOf((event.target.type || '').toLowerCase()) !== -1
          ? event.target.checked
          : event.target.value;
    }

    onChange(name || id, value, event);
  }
};

export const validateNumbers = (value) => {
  return value.replace(/[^0-9]/g, '');
};

export const isNumberKey = (event) => {
  if (event.key.length > 1) {
    return true;
  }

  if (isNaN(event.target.value + event.key)) {
    return false;
  }

  return true;
};
