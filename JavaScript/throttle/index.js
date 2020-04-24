// eslint-disable-next-line no-unused-vars
function throttle(func, delay = 200) {
  let canRun = true;

  // eslint-disable-next-line func-names
  return function (...rest) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      func.apply(this, rest);
      // canRun 设置为 true, 可进入下一次执行。
      canRun = true;
    }, delay);
  };
}
