let prefix = "./dist/";
let node_env;

function environment(idIndex, argIndex){
    if(process.argv[idIndex] && process.argv[argIndex]){
        switch (process.argv[idIndex]) {
            case "for":
            case "in":
                node_env = process.argv[argIndex] || process.env.NODE_ENV || 'development';
                break;
            default:
                node_env = 'development';
                break;
        }
    } else {
        node_env = 'development';
    }
    return node_env;
}
switch (process.argv[2] || "launch") {
    case "launch":
        let node_env = environment(3, 4);
        prefix += node_env;
        server = require(prefix + '/launch');
        break;
    case "build":
    case "watch":
    case "serve":
    case "module":
        require("./app/bs/main.js").parse(process.argv.splice(2));
        break;
    default:
        console.log("Check documentation or man for radix");
        break;
}
