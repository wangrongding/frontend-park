/* eslint-disable */

let inputFile: HTMLElement

function handleAttribute(inputFile: Element, multiple: boolean) {
  if (multiple) {
    inputFile.setAttribute('multiple', 'multiple')
  } else {
    inputFile.removeAttribute('multiple')
  }
}
// 创建input标签
function createInputFile(multiple: boolean) {
  inputFile = document.createElement('input')
  inputFile.setAttribute('id', 'myInput')
  inputFile.setAttribute('type', 'file')
  inputFile.setAttribute('accept', 'image/jpeg,image/jpg,image/png')
  inputFile.setAttribute('name', 'file')
  handleAttribute(inputFile, multiple)
  inputFile.setAttribute('style', 'display: none')
  document.body.appendChild(inputFile)
}

function pushFile(e: any) {
  const urlArr = []
  for (let i = 0; i < e.target!.files.length; i += 1) {
    urlArr.push(URL.createObjectURL(e.target.files[i]))
  }
  return urlArr
}

export function getFiles(multiple = true): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    if (document.getElementById('myInput')) {
      inputFile = document.getElementById('myInput')!
      await handleAttribute(inputFile, multiple)
    } else {
      createInputFile(multiple)
    }
    inputFile.onchange = (e) => {
      const files: string[] = pushFile(e)
      files.length > 0 ? resolve(files) : reject(new Error('没有选择文件'))
    }
    inputFile.click()
  })
}
