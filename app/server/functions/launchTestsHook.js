function* launchTestsHook() {
    console.log(radix.globals.WORKER.id + " [-] Executing Stack Tests");
    yield* hooks_tests();
    console.log(radix.globals.WORKER.id + " [-] Stack Tests executed");
}
