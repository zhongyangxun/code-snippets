const PENDING = 'pendintg';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
  const that = this;
  that.state = PENDING;
  that.value = '';
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];

  function resolve(value) {
    if (that.state === PENDING) {
      that.state = RESOLVED;
      that.value = value;
      that.resolvedCallbacks.map((cb) => cb(that.value));
    }
  }

  function reject(value) {
    if (that.state === PENDING) {
      that.state = REJECTED;
      that.value = value;
      that.rejectedCallbacks.map((cb) => cb(that.value));
    }
  }

  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

MyPromise.prototype.then = function then(onFulfilled, onRejected) {
  const fulfillHandler =
    typeof onFulfilled === 'function' ? onFulfilled : (v) => v;

  const rejectHandler =
    typeof onRejected === 'function' ? onRejected : (v) => v;

  const that = this;
  if (that.state === PENDING) {
    that.resolvedCallbacks.push(fulfillHandler);
    that.rejectedCallbacks.push(rejectHandler);
  }
  if (that.state === RESOLVED) {
    fulfillHandler(that.value);
  }
  if (that.state === REJECTED) {
    rejectHandler(that.value);
  }
};
