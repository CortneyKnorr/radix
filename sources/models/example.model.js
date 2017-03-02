function exampleModel(){
    const mongoose = getDependency('mongoose');
    const Schema = mongoose.Schema;
	const conv = radix.dapis.wizards.standards.ehgf13Arg;

    let structure = {
        foo: {type: String, required: true},
        bar: {type: String, required: true}
    };

    var schema = new Schema(structure);

    let model = mongoose.model("example", schema);

    model.fcs = {
		create: function* create(leanInstance){
			return yield (new model(leanInstance)).save();
		},
		byId: function(id) {
			return {
				get: function* get(){
					return yield model.findById(id);
				},
				delete: function* (){
					return yield model.findByIdAndRemove(id);
				},
				update: function* update(leanInstance){
					return yield model.findByIdAndUpdate(id, leanInstance, {new: true});
				}
			}
		},
		byName: function(name) {
			return {
				get: function* get(){
					return yield model.findOne({name});
	             }
            }
		},
		get: function* get(page, length){
			return yield model.find().skip(page*length).limit(length).lean();
		}
	};

	model.ehgs = {
		create(leanInstance){
			return function*(request, response, next){
				return response.send(yield* model.fcs.create(
					conv(leanInstance, request, false)
				));
			}
		},
		get(page, length){
			return function*(request, response, next){
				return response.send(yield* model.fcs.get(
					conv(page, request, false),
					conv(length, request, false)
				));
			}
		},
		byId(id){
			return {
				get(){
					return function*(request, response, next){
						return response.send(yield* model.fcs.byId(
							conv(id, request, false)
						).get());
					}
				},
				delete(){
					return function*(request, response, next){
						return yield* model.fcs.byId(
							conv(id, request, false)
						).delete();
					}
				},
				update(leanInstance){
					return function*(request, response, next){
						return response.send(yield* model.fcs.byId(
							conv(id, request, false)
						).update(
							conv(leanInstance, request, false)
						));
					}
				}
			}
		},
	};

    return model;
}
