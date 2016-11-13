function E2eFeatureBatch(batchObj) {
    this.batchObj = batchObj;
    this.features = {};

    for(let featureData of batchObj){
        this.features[featureData.name || "unnamed"] = stack.dapis.e2e.featureFactory(featureData);
    }

    this.testAllFeatures = function testAllFeatures(mute) {
        let self = this;
        return controlFlowCall(function*() {
            for (let featureName in self.features) {
                let feature = self.features[featureName];
                yield feature.testFeature(true);
            }
            if (!mute) {
                self.review();
            }
        })();
    };

    this.testFeature = function testFeature(featureName, mute) {
        let self = this;
        return controlFlowCall(function*() {
            let feature = self.features[featureName];
            if(feature){
                yield feature.testFeature(mute);
            } else {
                throw "Feature does not exist";
            }
        })();
    };

    this.review = function review() {
        for(let featureName in this.features){
            this.features[featureName].review();
        }
    };
}