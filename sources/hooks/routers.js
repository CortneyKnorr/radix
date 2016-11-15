function* hooks_routers() {
    return {
        "/": frontRouter,
        "/data": {
            "/files": {},

        }
    };
}
