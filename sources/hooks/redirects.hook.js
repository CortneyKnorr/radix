function* hooks_redirects() {
    return {
        "127.0.0.1:.*": new Redirect("http://localhost:"+$project.env.data.httpPort, true)
    }
}