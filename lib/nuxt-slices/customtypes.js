import Communication from '../communication';

const CustomTypes = {
  buildMetadata(customTypes) {
    return customTypes.map(elem => ({
      id: elem.mask_id,
      name: elem.mask_name,
      repeatable: elem.mask_repeatable,
      value: `${elem.mask_id}.json`,
    }));
  },

  async fetch(endpoint, cookies) {
    console.log('Log endpoint : ', endpoint);
    console.log('Log cookies : ', cookies);
    const _logHere = await Communication.get(endpoint, cookies);
    console.log('Log communication', _logHere);
    return JSON.parse(_logHere);
  },

  extractSlices(customTypes) {
    return customTypes.reduce((acc, customType) => ({ ...acc, ...customType.slices }), {});
  },
};

export default CustomTypes;
