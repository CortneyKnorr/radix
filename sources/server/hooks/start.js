function* hooks_start(){
    console.log("Juliettes is: "+ (yield* stack.dapis.groups.cfs.getUsersGroups("57eebf30166d0d2a3a703400")))
}