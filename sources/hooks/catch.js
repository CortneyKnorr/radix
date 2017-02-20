function* hooks_catch() {
    return {
        default: radix.dapis.useful.ehgs.plug(r => r.errors.toString()),
        404: function*(request, response, next){
            request.session.number = request.session.number ? request.session.number + 1: 1;
            response.send(request.session);
        }
    }
}
