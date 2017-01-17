function* hooks_catch() {
    return {
        default: radix.dapis.useful.ehgs.plug(r => r.errors.toString()),
    }
}