function* hooks_start(){
    stack.helpers.log(yield* stack.dapis.users.cfs.count())
}