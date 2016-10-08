function controlFlowCall(controlFlow){
    let next = (iter, cb, ecb, prev = undefined) => {
        const item = iter.next(prev);
        const value = item.value;

        if(item.done) return cb(prev);

        if(isPromise(value)){
            value.then(val => {
                try {
                    setImmediate(() => next(iter, cb, ecb, val));
                } catch(e) {
                    ecb(e);
                }
            }).catch(error => {
                ecb(error);
            });
        } else if(Array.isArray(value) && value.length > 0 && isPromise(value[0])) {
            Promise.all(value).then(val => {
                try {
                    setImmediate(() => next(iter, cb, ecb, val));
                } catch(e) {
                    ecb(e);
                }
            }).catch(error => {
                ecb(error);
            });
        } else {
            try {
                setImmediate(() => next(iter, cb, ecb, value));
            } catch(e) {
                ecb(e);
            }
        }
    };
    return (...args) => (new Promise((resolve, reject) => {
        next(controlFlow(...args), val => resolve(val), val => {
            reject(val)
        });
    }));

}