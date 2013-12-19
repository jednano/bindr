export function when(...promises: Promise[]): Promise {
	var done = new Deferred();
	var results = [];
	var remaining = promises.length;

	promises.map((p, i) => {
		p.then(
			(...args: any[]) => {
				results[i] = args;
				remaining--;
				if (!remaining && done.status !== 'rejected') {
					done.resolve.apply(done, results);
				}
			},
			() => { done.reject(); }
		);
	});

	if (!remaining) {
		done.resolve.apply(done, results);
	}

	return done.promise;
}

export class Promise {

	constructor(private deferred: Deferred) {
	}

	fail(error: Function): Promise {
		return this.deferred.fail(error);
	}

	then(callback: Function, error: Function): Promise {
		return this.deferred.then(callback, error);
	}

	done(callback: Function): void {
		return this.deferred.done(callback);
	}

	get status(): string {
		return this.deferred.status;
	}

	get result(): any[] {
		return this.deferred.result;
	}

}

export class Deferred {

	private resolved: Function[] = [];
	private rejected: Function[] = [];
	private _status: string;
	private _result: any[];
	private _promise: Promise;

	constructor() {
		this._promise = new Promise(this);
		this._status = 'in progress';
	}

	get promise(): Promise {
		return this._promise;
	}

	get status(): string {
		return this._status;
	}

	get result(): any[] {
		return this._result;
	}

	resolve(...result: any[]): Deferred {
		this._result = result;
		this.notify(this.resolved, result);
		this.resolved = [];
		this._status = 'resolved';
		return this;
	}

	reject(...result: any[]): Deferred {
		this._result = result;
		this.notify(this.rejected, result);
		this.rejected = [];
		this._status = 'rejected';
		return this;
	}

	then(callback: Function, error: Function): Promise {
		var d = new Deferred();
		this.resolved.push(this.wrap(d, callback, 'resolve'));
		this.rejected.push(this.wrap(d, error, 'reject'));
		this.checkStatus();
		return d.promise;
	}

	fail(error: Function): Promise {
		var d = new Deferred();
		this.rejected.push(this.wrap(d, error, 'reject'));
		this.checkStatus();
		return d.promise;
	}

	always(callback: Function): Promise {
		var d = new Deferred();
		this.resolved.push(this.wrap(d, callback, 'resolve'));
		this.rejected.push(this.wrap(d, callback, 'reject'));
		this.checkStatus();
		return d.promise;
	}

	done(callback: Function): void {
		this.then(callback, err => {
			if (err) {
				throw err;
			}
		});
	}

	private checkStatus() {
		if (this._status === 'resolved') {
			this.resolve.apply(this, this.result);
		} else if (this._status === 'rejected') {
			this.reject.apply(this, this.result);
		}
	}

	private wrap(d: Deferred, f: Function, method: string): Function {
		return (...args: any[]) => {
			var result = f.apply(f, args);
			if (result && result instanceof Promise) {
				result.then(
					() => { d.resolve(); },
					() => { d.reject(); }
				);
			} else {
				d[method].apply(d, [result]);
			}
		};
	}

	private notify(funcs: Function[], result: any[]): void {
		funcs.map((f) => { f.apply(f, result); });
	}

}
