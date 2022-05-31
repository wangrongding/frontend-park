/* eslint-disable */
async function handleAttribute(inputFile: Element, multiple: boolean) {
  if (multiple) {
    await inputFile.setAttribute('multiple', 'multiple')
  } else {
    await inputFile.removeAttribute('multiple')
  }
}

export function inputFile(multiple = true) {
  return new Promise(async (resolve, reject) => {
    if (document.getElementById('myInput')) {
      const inputFile = document.getElementById('myInput')!
      await handleAttribute(inputFile, multiple)
      inputFile.onchange = (e: any) => {
        const urlArr = []
        for (let i = 0; i < e.target!.files.length; i += 1) {
          urlArr.push(URL.createObjectURL(e.target.files[i]))
        }
        resolve(urlArr)
      }
      inputFile.click()
    } else {
      const inputFile = document.createElement('input')
      inputFile.setAttribute('id', 'myInput')
      inputFile.setAttribute('type', 'file')
      inputFile.setAttribute('accept', 'image/jpeg,image/jpg,image/png')
      inputFile.setAttribute('name', 'file')

      await handleAttribute(inputFile, multiple)

      inputFile.setAttribute('style', 'display: none')
      inputFile.onchange = (e: any) => {
        const urlArr = []
        for (let i = 0; i < e.target!.files.length; i++) {
          urlArr.push(URL.createObjectURL(e.target.files[i]))
        }
        resolve(urlArr)
      }
      document.body.appendChild(inputFile)
      inputFile.click()
    }
  })
}
