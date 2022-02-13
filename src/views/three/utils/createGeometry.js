import * as THREE from "three";
//创建几何体
export default function (scene, geometryParam, materialParam, options) {
    //定义几何体类型
    let geometry = new THREE[geometryParam.type](...geometryParam.attribute);
    //定义几何体材质
    let material = new THREE[materialParam.type](materialParam.options);
    //创建几何体
    let geometryObj = new THREE.Mesh(geometry, material);

    if (options) {
        for (let item in options) {
            console.log("🚀🚀🚀 / item", options, item, options[item]);
            if (item == "position") {
                geometryObj[item].set(...options[item]);
            } else {
                geometryObj[item] = options[item];
            }
        }
    }
    scene.add(geometryObj);
    return geometryObj;
}
