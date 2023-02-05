// const { fromEvent, tap, map, interval, switchAll } = rxjs;
const { switchAll1, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { switchAll, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
const clicks = fromEvent(document, 'click').pipe(tap(() => console.log('click')));
const source = clicks.pipe(map(() => interval(1000)));

source
  .pipe(switchAll())
  .subscribe(x => console.log(x));

// Output
// click
// 0
// 1
// 2
// 3
// ...
// click
// 0
// 1
// 2
// ...
// click
// ...