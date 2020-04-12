const PENDING = 'pendintg';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
  const that = this;
  that.state = PENDING;
  that.value = '';
  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];

  function reject(value) {
    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = REJECTED;
        that.value = value;
        that.rejectedCallbacks.map((cb) => cb(that.value));
      }
    });
  }

  function resolve(value) {
    if (value instanceof MyPromise) {
      value.then(resolve, reject);
    }

    setTimeout(() => {
      if (that.state === PENDING) {
        that.state = RESOLVED;
        that.value = value;
        that.resolvedCallbacks.map((cb) => cb(that.value));
      }
    });
  }

  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function processPromise(promise2, value, resolve, reject) {
  if (promise2 === value) {
    throw new TypeError('Error');
  }

  let called = false;

  if (
    value !== null &&
    (typeof value === 'function' || typeof value === 'object')
  ) {
    const { then } = value;
    if (typeof then === 'function') {
      try {
        then.call(
          value,
          (x) => {
            if (called) return;
            called = true;
            processPromise(promise2, x, resolve, reject);
          },
          (e) => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } catch (e) {
        reject(e);
      }
    } else {
      resolve(value);
    }
  } else {
    resolve(value);
  }
}

MyPromise.prototype.then = function then(onFulfilled, onRejected) {
  const fulfillHandler =
    typeof onFulfilled === 'function' ? onFulfilled : (v) => v;

  const rejectHandler =
    typeof onRejected === 'function' ? onRejected : (v) => v;

  const that = this;
  const promise2 = new MyPromise((resolve, reject) => {
    if (that.state === PENDING) {
      that.resolvedCallbacks.push(() => {
        try {
          const val = fulfillHandler(that.value);
          processPromise(promise2, val, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });

      that.rejectedCallbacks.push(() => {
        try {
          const val = fulfillHandler(that.value);
          processPromise(promise2, val, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }

    if (that.state === RESOLVED) {
      try {
        // 前一个 then 的成功回调
        const x = fulfillHandler(that.value);
        // 触发后一个 then 的成功回调
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }

    if (that.state === REJECTED) {
      try {
        const x = rejectHandler(that.value);
        reject(x);
      } catch (e) {
        reject(e);
      }
    }
  });

  return promise2;
};
