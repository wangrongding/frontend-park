// @ts-nocheck
/* eslint-disable */
export function mostBlockColor(blockList) {
  const blockMainColors = []
  for (let i = 0; i < blockList.length; i++) {
    const colorList = []
    let rgbaStr = ''
    for (let k = 0; k < blockList[k].color.length; k++) {
      rgbaStr = blockList[i].color[k]
      if (rgbaStr in colorList) {
        ++colorList[rgbaStr]
      } else {
        colorList[rgbaStr] = 1
      }
    }
    const arr = []
    for (const prop in colorList) {
      arr.push({
        // 如果只获取rgb,则为`rgb(${prop})`
        color: prop.split(','),
        // color: `rgba(${prop})`,
        count: colorList[prop],
      })
    }
    // 数组排序
    arr.sort((a, b) => b.count - a.count)
    arr[0].position = blockList[i].position
    blockMainColors.push(arr[0])
  }
  return blockMainColors
}
