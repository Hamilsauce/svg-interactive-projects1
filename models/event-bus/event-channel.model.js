const { combineLatest, asObservable, iif, BehaviorSubject, ReplaySubject, AsyncSubj, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, groupBy, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
import { EventMessage } from './event-message.model.js'

export class EventChannel {
  constructor(channelName, initialData = null) {
    this._name = channelName;

    this._source$ = initialData !== null ?
      new BehaviorSubject({ ...initialData }) :
      new Subject();

    this.state$ = this._source$
      .pipe(
        distinctUntilChanged((lastMsg, newMsg) => {
          return lastMsg.id === newMsg.id // : false
        }),
        scan((state, data) => {
          return state ? { ...state, ...data } : { ...data };
        }),
      );

    this.stateObservable$ = this.state$.asObservable()

  }

  listen(filterFn = (msg) => {}) {
    return this.stateObservable$.pipe()
  }

  createMsg(data) {
    return {
      channelName: this.name,
      ...data,
    }
  }

  send(data) {
    const msgDetail = {
      channelName: 'fs',
      ...data,
    }
    const msg = new EventMessage(msgDetail)

    this._source$.next(msg);
    return msg;
  }

  post(data) {
    const msg = new Message({ channelName: this.name, payload: { ...data } })

    this._source$.next(msg);
    return msg;
  }

  get value() { return this._source$.getValue() };

  get name() { return this._name };

  set name(newValue) { this._name = newValue };
}
