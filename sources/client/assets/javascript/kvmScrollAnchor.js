document.getAllElementsWithAttribute = function (attribute) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) !== null) {
            // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
};


var ScrollAnchor = function(anchorId, associatedTag){

    this.associatedTag = document.getElementById(associatedTag) || false;
    this.anchor = document.getElementById(anchorId) || false;
    this.anchorOffset = null;
    this.originalDeltaY = null;
    var anchor = this.anchor;
    var anchorOffset = this.anchorOffset;
    var originalDeltaY = this.originalDeltaY;

    component = window;

    var animate = (function(){
        var action = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        return function(runner){
            action.call(window, runner);
        };
    })();

    var scroll = function(nextStep){
        if(nextStep == null) {
            return component.scrollY != null ? component.scrollY : component.scrollTop;
        }
        else if(originalDeltaY > 0 ? nextStep < anchorOffset : nextStep >= anchorOffset) {
            component.scrollTo ? component.scrollTo(0, anchorOffset):component.scrollTop = anchorOffset;
            return 0;
        }
        else {
            component.scrollTo ? component.scrollTo(0, nextStep) : component.scrollTop = nextStep;
            return nextStep;
        }
    };

    var speedConduct = function(current){
        var progress = 1 - Math.abs(current - anchorOffset)/originalDeltaY;
        var speed = (0.5 - Math.abs(progress - 0.5)) * 2;
        var displacement = 20 + Math.floor(100*speed*speed);
        console.log(displacement);
        return displacement;
    };

    this.debug = function () {
        console.log(scroll() - ( this.anchor ? this.anchor.offsetTop : 0));
    };

    this.scrollTo = function(time){
        var DEFAULT_TIME = 1000;
        if(time == null) {
            time = DEFAULT_TIME;

        }
        var originY = scroll();
        this.anchorOffset = anchorOffset = ( this.anchor ? this.anchor.offsetTop : 0);
        this.originalDeltaY = originalDeltaY = scroll() - this.anchorOffset;
        var currentY = originY;
        var originSpeed = this.originalDeltaY / (time / 60);
        var currentSpeed;

        if(originalDeltaY == 0){
            return 0;
        }

        (function operate(){
            currentSpeed = speedConduct(currentY);
            currentY = currentY - (originalDeltaY >= 0 ?  1 : -1) * currentSpeed;
            var debug = scroll(currentY);
            if(debug !== 0 && window.scrollY == currentY) {
                animate(operate);
            } else {
                window.scrollTo(0, anchorOffset);
            }
        })();
    };
};
ScrollAnchor.top = (new ScrollAnchor()).scrollTo;
ScrollAnchor.addElementAsTopSensitive = function (element) {
    window.addEventListener("scroll", function(){
        if(window.scrollY == 0){
            element.classList.add("scrollTop");
        } else {
            element.classList.remove("scrollTop");
        }
    });
    if(window.scrollY == 0){
        element.classList.add("scrollTop");
    }
};
ScrollAnchor.addElementAsNearTopSensitive = function (element, distanceArg) {
    var distance = distanceArg;
    window.addEventListener("scroll", function(){
        if(window.scrollY < distance){
            element.classList.add("nearTop");
        } else {
            element.classList.remove("nearTop");
        }
    });
    if(window.scrollY < distance){
        element.classList.add("scrollTop");
    }
};
ScrollAnchor.loadTopSensitiveElements = function () {
    var elements = document.getAllElementsWithAttribute("data-topSensitive");
    for(var elementIndex in elements){
        ScrollAnchor.addElementAsTopSensitive(elements[elementIndex])
    }
    elements = document.getAllElementsWithAttribute("data-nearTopSensitive");
    for(elementIndex in elements){
        var element = elements[elementIndex];
        if(element.getAttribute("data-nearTopSensitive")){
            ScrollAnchor.addElementAsNearTopSensitive(element, element.getAttribute("data-nearTopSensitive"));
        } else {
            ScrollAnchor.addElementAsTopSensitive(element);
        }
    }
};


window.anchors = [];
window.addEventListener("scroll", function () {
    var soffset = 100000;
    var manchor = false;
    for(var anchorIndex in window.anchors){
        var anchor = window.anchors[anchorIndex];
        if(anchor.associatedTag){
            anchor.associatedTag.classList.remove("anchorActive");
        }
        var delta = Math.abs(anchor.anchor.offsetTop - window.scrollY);
        if(delta < soffset){
            soffset = delta;
            manchor = anchor;
        }
    }
    if(manchor){
        if(manchor.associatedTag) {
            manchor.associatedTag.classList.add("anchorActive");
        }
    }
}, false);
