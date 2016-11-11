
export function configure(aurelia) {
    aurelia.use.basicConfiguration();
    console.log(aurelia);
    core.ViewLocator.prototype.convertOriginToViewUrl = (origin) => {
        let moduleId = origin.moduleId;
        return "view.html";
    };

    aurelia.start().then(() => aurelia.setRoot('/assets/javascript/app.esnext.js'));
}