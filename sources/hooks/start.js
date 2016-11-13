function* hooks_start() {
    let a = yield stackCapture(function*() {
        console.log("Hello world");
    }, "jump");
    let b = yield stackCapture(function*() {
        console.log("Hello world");
    }, "jump");

}