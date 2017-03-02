function* hooks_middleware() {
	return [
		function* poweredBy(request, response, next) {
			response.setHeader("x-powered-by", "Radix");
        		next();
	    	}
	]
};
