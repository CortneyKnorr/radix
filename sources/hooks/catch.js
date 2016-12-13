function* hooks_catch() {
    return {
        default: stack.dapis.useful.ehgs.plug(r => r.errors.toString()),
    }
}