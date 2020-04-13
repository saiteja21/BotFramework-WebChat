import { call, fork } from 'redux-saga/effects';

import createPromiseQueue from '../../createPromiseQueue';

export default function observeEachEffect(observable, fn) {
  return call(function* observeEach() {
    const queue = createPromiseQueue();
    const subscription = observable.subscribe({
      complete: () => queue.push({ complete: {} }),
      error: error => queue.push({ error }),
      next: value => queue.push({ next: value })
    });

    try {
      for (;;) {
        const result = yield call(queue.shift);

        if ('complete' in result) {
          break;
        } else if ('error' in result) {
          throw error;
        } else {
          yield fork(fn, result.next);
        }
      }
    } finally {
      subscription.unsubscribe();
    }
  });
}
