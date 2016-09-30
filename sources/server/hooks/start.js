var hooks_start = function* (){
    console.log(yield* stack.dapis.users.cfs.create("CortneyCss", "password", 1));

};