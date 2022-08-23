// @ts-nocheck
/* eslint-disable */
import * as THREE from 'three'
// 创建几何体
export default function (scene, geometryParam, materialParam, options) {
  // 定义几何体类型
  const geometry = new THREE[geometryParam.type](...geometryParam.attribute)
  // 定义几何体材质
  const material = new THREE[materialParam.type](materialParam.options)
  // 创建几何体
  const geometryObj = new THREE.Mesh(geometry, material)

  if (options) {
    for (const item in options) {
      if (item === 'position') {
        geometryObj[item].set(...options[item])
      } else {
        geometryObj[item] = options[item]
      }
    }
  }
  scene.add(geometryObj)
  return geometryObj
}
