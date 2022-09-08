interface Upload {
  text: string
  action: string
  accept: string
  autoUpload: boolean
  fileList: any[]
  listType: 'text' | 'picture' | 'picture-card'
  httpRequest: (file: File) => void
  onPreview: (file: File) => void
  onRemove: (file: File) => void
  onBeforeRemove: (file: File) => void
  onExceed: (file: File) => void
  onError: (error: Error) => void
}
interface ItemForm extends Partial<Upload> {
  type: string
  label: string
  placeholder?: string
  mode?: string
  disabled?: boolean
  style?: string
  onChange?: () => void
  [propName: string]: any
}
interface Action {
  submitFunction: () => void
  cancelFunction: () => void
  submitText?: string
  submitDisabled?: boolean
  submitIcon?: string
  submitType?: string
  submitStyle?: string
  [propName: string]: any
}

export interface FormOptions {
  data: any // 表单数据对象
  formList: { [propName: string]: ItemForm }
  rules: object // 表单验证规则
  inline: boolean // 行内表单模式
  labelWidth: string // 表单域标签的宽度('123px') 支持 auto
  // loading: boolean
  labelColor?: string // 表单域标签的颜色
  size?: '' | 'default' | 'small' | 'large' // 用于控制该表单内组件的尺寸 可选值：medium / small / mini
  statusIcon?: boolean // 是否在输入框中显示校验结果反馈图标
  validateOnRuleChange?: boolean // 是否在 rules 属性改变后立即触发一次验证
  scrollToError?: boolean // 当校验失败时，滚动到第一个错误表单项
  showMessage?: boolean // 是否显示校验错误信息
  inlineMessage?: boolean // 是否以行内形式展示校验信息
  disabled?: boolean // 是否禁用该表单内的所有组件
  hideRequiredAsterisk?: boolean // 是否显示必填字段的标签旁边的红色星号
  labelSuffix?: string // 表单域标签的后缀,''
  labelPosition?: 'left' | 'right' // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width 可选值：right/left/top
  align?: string
  action?: Action // 表单的操作方法
}
