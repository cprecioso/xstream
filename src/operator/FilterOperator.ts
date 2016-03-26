import {Listener} from '../Listener';
import {Operator} from '../Operator';
import {Stream} from '../Stream';
import {emptyListener} from '../utils/emptyListener';

export class Proxy<T> implements Listener<T> {
  constructor(public out: Stream<T>,
              public p: FilterOperator<T>) {
  }

  next(t: T) {
    if (this.p.predicate(t)) this.out.next(t);
  }

  error(err: any) {
    this.out.error(err);
  }

  end() {
    this.out.end();
  }
}

export class FilterOperator<T> implements Operator<T, T> {
  public proxy: Listener<T> = emptyListener;

  constructor(public predicate: (t: T) => boolean,
              public ins: Stream<T>) {
  }

  start(out: Stream<T>): void {
    this.ins.addListener(this.proxy = new Proxy(out, this));
  }

  stop(): void {
    this.ins.removeListener(this.proxy);
  }
}