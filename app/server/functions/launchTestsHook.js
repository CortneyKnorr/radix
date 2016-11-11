function* launchTestsHook() {
    console.log(stack.globals.WORKER.id + " [-] Executing Stack Tests");
    yield* hooks_tests();
    console.log(stack.globals.WORKER.id + " [-] Stack Tests executed");
}
