function controlFlowCall(controlFlow){
    let next = (iter, cb, ecb, prev = undefined) => {
        const item = iter.next(prev);
        const value = item.value;

        if(item.done) return cb(prev);

        if(typeof value !== 'undefined' && typeof value.then === 'function'){
            value.then(val => {
                setImmediate(() => next(iter, cb, ecb, val));
            }).catch(error => {
                console.log(ecb);
                ecb(error);
            });
        } else {
            setImmediate(() => next(iter, cb, ecb, value));
        }
    };
    return (...args) => (new Promise((resolve, reject) => {
        next(controlFlow(...args), val => resolve(val), val => reject(val));
    }));

}