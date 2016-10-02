function* hooks_start(){
    stack.helpers.log(yield* stack.dapis.users.cfs.getPaged(0, 3));
}