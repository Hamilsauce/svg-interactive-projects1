const { BehaviorSubject, Subject } = rxjs
const { shareReplay, distinctUntilChanged, tap, map, scan } = rxjs.operators;

const AUTH_KEY = '123';

export const EntityInterface = {
  
}


class EntityPipe extends BehaviorSubject {
  #input$ = new Subject();
  #reducePipe$ = null;
  #reducer = null;
  #stateSubscription = null;
  #name = null;

  constructor(name, storeOptions = StoreOptionsDef) {
    if (!(name && storeOptions.state && storeOptions.reducer) || storeOptions.isDef) return;

    super(storeOptions.state);
  }

  next(newValue, authKey) {
    if (authKey != AUTH_KEY || typeof newValue != 'object') throw new Error('ILLEGAL CALL TO STORE.NEXT OR INVALID VALUE PASSED TO STORE.UPDATE');

    super.next(newValue);
  }
  
  push(newValue, authKey) {
    if (authKey != AUTH_KEY || typeof newValue != 'object') throw new Error('ILLEGAL CALL TO STORE.NEXT OR INVALID VALUE PASSED TO STORE.UPDATE');

    super.next(newValue);
  }
  
  
  connect(entity) {
    if (authKey != AUTH_KEY || typeof newValue != 'object') throw new Error('ILLEGAL CALL TO STORE.NEXT OR INVALID VALUE PASSED TO STORE.UPDATE');

    super.next(newValue);
  }
  


  select(selectorFn = (state) => state) {
    return this.asObservable()
      .pipe(
        map(selectorFn),
        distinctUntilChanged( /* Put something good here */ ),
        shareReplay(1),
      );
  }
  
}