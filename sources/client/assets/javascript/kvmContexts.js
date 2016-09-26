var generic;
(function (generic) {
    var visibility;
    (function (visibility) {
        function toggle(htmlElementIdArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute('data-kvm-state')) {
                htmlElementArg.setAttribute('data-kvm-state', htmlElementArg.getAttribute('data-kvm-state') == 'shown' ? 'hidden' : 'shown');
                return true;
            }
            else {
                return false;
            }
        }
        visibility.toggle = toggle;
        function hide(htmlElementIdArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute('data-kvm-state')) {
                htmlElementArg.setAttribute('data-kvm-state', 'hidden');
                return true;
            }
            else {
                return false;
            }
        }
        visibility.hide = hide;
        function show(htmlElementIdArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute('data-kvm-state')) {
                htmlElementArg.setAttribute('data-kvm-state', 'shown');
                return true;
            }
            else {
                return false;
            }
        }
        visibility.show = show;
    })(visibility = generic.visibility || (generic.visibility = {}));
    var kvmContexts;
    (function (kvmContexts) {
        var attributeIdentifier = 'data-kvm-context';
        function inc(htmlElementIdArg, maxStatesArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute(attributeIdentifier)) {
                htmlElementArg.setAttribute(attributeIdentifier, ((eval(htmlElementArg.getAttribute(attributeIdentifier)) + 1) % maxStatesArg).toString());
                return true;
            }
            else {
                return false;
            }
        }
        kvmContexts.inc = inc;
        function dec(htmlElementIdArg, maxStatesArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute(attributeIdentifier)) {
                var tempContext = (eval(htmlElementArg.getAttribute(attributeIdentifier)) - 1) % maxStatesArg;
                htmlElementArg.setAttribute(attributeIdentifier, (tempContext < 0) ? maxStatesArg + tempContext : tempContext);
                return true;
            }
            else {
                return false;
            }
        }
        kvmContexts.dec = dec;
        function reset(htmlElementIdArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute(attributeIdentifier)) {
                htmlElementArg.setAttribute(attributeIdentifier, '0');
                return true;
            }
            else {
                return false;
            }
        }
        kvmContexts.reset = reset;
        function fixe(htmlElementIdArg, contextArg) {
            var htmlElementArg = document.getElementById(htmlElementIdArg);
            if (htmlElementArg.hasAttribute(attributeIdentifier)) {
                htmlElementArg.setAttribute(attributeIdentifier, contextArg.toString());
                return true;
            }
            else {
                return false;
            }
        }
        kvmContexts.fixe = fixe;
    })(kvmContexts = generic.kvmContexts || (generic.kvmContexts = {}));
    var eventForCss;
    (function (eventForCss) {
        function scrollFromTop(htmlElementArg) {
            htmlElementArg.addEventListener('scroll', function () {
                (htmlElementArg.scrollTop > 0) ? htmlElementArg.setAttribute('data-kvm-scrolled', 'scrolled') : htmlElementArg.setAttribute('data-kvm-scrolled', 'top');
            });
        }
        eventForCss.scrollFromTop = scrollFromTop;
    })(eventForCss = generic.eventForCss || (generic.eventForCss = {}));
})(generic || (generic = {}));