// eslint-disable-next-line no-unused-vars
function debouce(func, delay = 200) {
  let timeout = null;

  // eslint-disable-next-line func-names
  return function (...rest) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, rest);
    }, delay);
  };
}
