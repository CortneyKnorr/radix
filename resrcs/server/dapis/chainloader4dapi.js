function stack_dapis() {
    stack.models.content = getDependency(dapi_model_content);
    stack.models.file = getDependency(dapi_model_file);
    stack.models.groups = getDependency(dapi_model_groups);
    stack.models.users = getDependency(dapi_model_users);
}