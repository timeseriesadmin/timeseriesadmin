export function commonError(error) {
  if (error.isCommon) {
    return error;
  }

  if (error.response && error.response.status && error.response.statusText) {
    console.log('request error');
    // probably a request error
    return {
      title: `${error.response.status}: ${error.response.statusText}`,
      details: error,
      isCommon: true,
    };
  }

  if (error.code && error.message && error.stack) {
    console.log('native error');
    // probably a NodeJS or browser native error
    return {
      title: `${error.code}: ${error.message}`,
      details: error.stack,
      isCommon: true,
    };
  }

  if (error.message) {
    console.log('network error');
    // probably a network error
    return {
      title: error.message,
      details: error,
      isCommon: true,
    };
  }

  if (error.isAxiosError) {
    console.log('axios error');
    return {
      title: error.code,
      details: error,
      isCommon: true,
    };
  }

  // all other cases
  return {
    title: 'Unknown unexpected error',
    details: error,
    isCommon: true,
  };
}

// exports.commonError = commonError;
// module.exports.commonError = commonError;
