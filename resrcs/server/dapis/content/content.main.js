// var dapi = dapi || {};
// dapi.content = dapi.content || {};
// dapi.content.interface = {};
// stack = stack || {};
// stack.dapis = stack.dapis || {};
//
// dapi.content.newInstance = function (content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent) {
//     var Content = getDependency(dapi_model_content);
//     var myNewContent = new Content();
//     myNewContent.title = title;
//     myNewContent.content = content;
//     myNewContent.channel = channel;
//     myNewContent.tags = tags;
//     myNewContent.rights = rights;
//     myNewContent.author = author;
//     myNewContent.isPublic = isPublic;
//     myNewContent.children = [];
//     myNewContent.hasParent = hasParent;
//     myNewContent.identifier = identifier;
//     myNewContent.properties = properties;
//     return myNewContent;
// };
//
// dapi.content.deleteWithChildren = function (objectId) {
//     return dapi.content.getChildren(objectId)
//         .then(data => {
//             if (data) {
//                 let promiseArray = [];
//                 for (let child of data) {
//                     promiseArray.push(dapi.content.deleteWithChildren(child._id));
//                 }
//                 promiseArray.push(dapi.content.delete(objectId));
//                 return Promise.all(promiseArray);
//             } else {
//                 return dapi.content.delete(objectId);
//             }
//         })
//         ;
// };
//
// dapi.content.new = function (content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent) {
//     return dapi.content.getAllIdentifiers(channel)
//         .then(data => {
//             if (identifier) {
//                 for (var object of data) {
//                     if (object.identifier == identifier) {
//                         return new Promise((resolve, reject) => {
//                             reject("Identifier allready exists")
//                         });
//                     }
//                 }
//             }
//             var myInstance = dapi.content.newInstance(content, title, identifier, channel, tags, properties, rights, author, isPublic, hasParent);
//             return myInstance.save();
//         })
//     ;
// };
//
// dapi.content.delete = function (id) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findByIdAndRemove(id);
// };
//
// dapi.content.get = function (id) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findById(id).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]).exec();
// };
// dapi.content.getChildren = function (id) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findById(id, "children").populate('children').then(data => {
//         if (data) {
//             return data.children;
//         } else {
//             return new Promise((resolve, reject) => {
//                 reject("Object does not exist")
//             });
//         }
//     });
// };
// dapi.content.getPublic = function (channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel ? {isPublic: true, channel: channel} : {isPublic: true}).populate([{
//         path: 'children',
//         select: ''
//     }, {path: 'author', select: 'username'}]);
// };
// dapi.content.getAllowed = function (rights, channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel
//             ? {
//             $and: [
//                 {channel: channel},
//                 {
//                     $or: [
//                         {$where: "this.rights <= " + rights.toString()},
//                         {isPublic: true}
//                     ]
//                 }
//             ]
//         }
//             : {
//             $or: [
//                 {$where: "this.rights <= " + rights.toString()},
//                 {isPublic: true}
//             ]
//         }
//     ).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
// dapi.content.getAll = function (channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel ? {channel: channel} : {}).populate([{path: 'children', select: ''}, {
//         path: 'author',
//         select: 'username'
//     }]);
// };
// dapi.content.getByIdentifier = function (channel, identifier) {
//     if (channel) {
//         var Content = getDependency(dapi_model_content);
//         return Content.findOne({
//             $and: [
//                 {channel: channel},
//                 {identifier: identifier}
//             ]
//         }).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
//     } else {
//         throw "Channel arg is not defined";
//     }
// };
// dapi.content.getAllIdentifiers = function (channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel ? {channel: channel} : {}, "identifier").lean().exec();
// };
// dapi.content.getAllTopLevel = function (channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel ? {
//         $and: [
//             {channel: channel},
//             {hasParent: {$ne: true}}
//         ]
//     } : {hasParent: {$ne: true}}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
// dapi.content.getAllPublicTopLevel = function (channel) {
//     var Content = getDependency(dapi_model_content);
//     return Content.find(channel ? {
//         $and: [
//             {isPublic: true},
//             {channel: channel},
//             {hasParent: {$ne: true}}
//         ]
//     } : {hasParent: {$ne: true}}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
//
// dapi.content.update = function (id, content, identifier, channel, title, tags, properties, rights, author, isPublic, hasParent) {
//     var Content = getDependency(dapi_model_content);
//     return dapi.content.getAllIdentifiers(channel)
//         .then(data => {
//             if (identifier) {
//                 for (var object of data) {
//                     if (object.identifier == identifier && object._id != id) {
//                         return new Promise((resolve, reject) => {
//                             reject("Identifier allready exists")
//                         });
//                     }
//                 }
//             }
//             return Content.findByIdAndUpdate(id, {
//                 content: content,
//                 title: title,
//                 channel: channel,
//                 tags: tags,
//                 rights: rights,
//                 author: author,
//                 identifier: identifier,
//                 isPublic: isPublic,
//                 properties: properties,
//                 hasParent: hasParent
//             }, {new: true}).populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
//         })
//         ;
// };
//
// dapi.content.updateProperties = function (id, properties) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findByIdAndUpdate(id, {properties: properties}, {new: true})
//         .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
// dapi.content.makePublic = function (id) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findByIdAndUpdate(id, {isPublic: true}, {new: true})
//         .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
// dapi.content.makePrivate = function (id) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findByIdAndUpdate(id, {isPublic: false}, {new: true})
//         .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
// };
//
// dapi.content.addChild = function (parentId, childId) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findByIdAndUpdate(parentId, {$addToSet: {children: childId}}, {new: true})
//         .then(data => {
//             return Content.findByIdAndUpdate(childId, {hasParent: true}, {new: true})
//                 .populate([{path: 'children', select: ''}, {path: 'author', select: 'username'}]);
//         });
// };
// dapi.content.updateProperty = function (id, property, stringValue) {
//     var Content = getDependency(dapi_model_content);
//     return Content.findById(id)
//         .then(data => {
//             data.properties[property] = stringValue;
//             return data.save()
//         });
// };
//
// dapi.content.createAndBind = function (parentId, content, title, identifier, channel, tags, properties, rights, author, isPublic) {
//     return dapi.content.get(parentId).then(data => {
//         if (data) {
//             return dapi.content.new(content, title, identifier, channel, tags, properties, rights, author, isPublic, true).then(data => {
//                 return dapi.content.addChild(parentId, data._id);
//             });
//         } else {
//             return new Promise((resolve, reject) => {
//                 reject("Object does not exist")
//             });
//         }
//     });
// };
// dapi.content.ehCreateAndBind = function () {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.createAndBind(
//             data.parentId,
//             data.content,
//             data.title,
//             data.identifier,
//             data.channel,
//             data.tags,
//             data.properties,
//             data.rights,
//             data.author,
//             data.isPublic
//         ).then(data => {
//             response.send(data);
//         }).catch(errors => {
//             response.send(errors)
//         });
//     };
// };
//
// dapi.content.ehCreatePublic = function (rights) {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.new(data.content, data.title, data.identifier, data.channel, data.tags || [], data.properties || [], rights, data.author, true, false)
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors)
//             })
//         ;
//     };
// };
//
// dapi.content.ehCreateRestricted = function (rights) {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.new(data.content, data.title, data.identifier, data.channel, data.tags, data.properties || [], rights, data.author, false, false)
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors)
//             })
//         ;
//     };
// };
//
// dapi.content.ehYieldSpecific = function (id) {
//     return function (request, response, next) {
//         dapi.content.get(id)
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors)
//             })
//         ;
//     };
// };
//
// dapi.content.ehYield = function (fieldName) {
//     return function (request, response, next) {
//         dapi.content.get(request.params[fieldName || "id"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors)
//             })
//         ;
//     };
// };
//
// dapi.content.ehDelete = function (fieldName) {
//     return function (request, response, next) {
//         dapi.content.delete(request.params[fieldName || "id"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors)
//             })
//         ;
//     };
// };
//
// dapi.content.ehUpdate = function (idFieldName) {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.update(
//             request.params[idFieldName || "id"],
//             data.content,
//             data.identifier,
//             data.channel,
//             data.title,
//             data.tags,
//             data.properties,
//             data.rights,
//             data.author,
//             data.isPublic
//         )
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehUpdateProperties = function (idFieldName, propertiesFieldName) {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.updateProperties(request.params[idFieldName || "id"], data[propertiesFieldName || "properties"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehMakePublic = function (idFieldNamee) {
//     return function (request, response, next) {
//         dapi.content.makePublic(request.params[idFieldName || "id"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehMakePrivate = function (idFieldName) {
//     return function (request, response, next) {
//         dapi.content.makePrivate(request.params[idFieldName || "id"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehYieldAllowedBySpecificLimit = function (rights, channel) {
//     return function (request, response, next) {
//         var data = request.body;
//         dapi.content.getAllowed(rights, channel)
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehYieldAll = function (channel) {
//     return function (request, response, next) {
//         var promise = dapi.content.getAll(channel)
//                 .then(data => {
//                     response.send(data);
//                 })
//                 .catch(errors => {
//                     response.send(errors);
//                 })
//             ;
//     };
// };
//
// dapi.content.ehYieldAllTopLevel = function (channel) {
//     return function (request, response, next) {
//         dapi.content.getAllTopLevel(channel)
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     }
// };
//
// dapi.content.ehUpdateProperty = function (idFieldName, propertyFieldName, valueFieldName) {
//     return function (request, response, next) {
//         dapi.content.updateProperty(request.params[idFieldName || "id"], request.body[propertyFieldName || "property"], request.body[valueFieldName || "value"])
//             .then(data => {
//                 response.send(data);
//             })
//             .catch(errors => {
//                 response.send(errors);
//             })
//         ;
//     };
// };
//
// dapi.content.ehYieldAllowedByUser = function (channel) {
//     return function (request, response, next) {
//         var data = request.body;
//         if (request.user) {
//             if (request.user.admin) {
//                 dapi.content.getAll(channel)
//                     .then(data => {
//                         response.send(data);
//                     })
//                     .catch(errors => {
//                         response.send(errors);
//                     })
//                 ;
//             }
//             else if (request.user.rights) {
//                 dapi.content.getAllowed(request.user.rights, channel)
//                     .then(data => {
//                         response.send(data);
//                     })
//                     .catch(errors => {
//                         response.send(errors);
//                     })
//                 ;
//             }
//         } else {
//             dapi.content.getPublic(channel)
//                 .then(data => {
//                     response.send(data);
//                 })
//                 .catch(errors => {
//                     response.send(errors);
//                 })
//             ;
//         }
//     };
// };
//
// stack.dapis.content = dapi.content;