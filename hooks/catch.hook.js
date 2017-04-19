function* hooks_catch() {
    return {
        default: $libraries.useful.ehgs.plug(r => r.errors.toString())
    }
}
