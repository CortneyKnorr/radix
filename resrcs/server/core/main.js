function* stack_main(){
    throw "error";
    yield* stack_bootstrapper();
}