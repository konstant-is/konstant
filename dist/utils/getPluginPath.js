import pkg from '../../package.json';
const PLUGIN_PATH = pkg.name;
export const getPluginPath = (type, path)=>{
    return `${PLUGIN_PATH}/${type}${path}`;
};

//# sourceMappingURL=getPluginPath.js.map