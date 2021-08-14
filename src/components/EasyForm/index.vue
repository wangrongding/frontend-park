<template>
    <el-form
        v-loading="formParams.loading"
        ref="easy-form"
        :model="formParams.data"
        :rules="formParams.rules"
        :inline="formParams.inline"
        :label-position="formParams.labelPosition"
        :label-width="formParams.labelWidth"
        :label-suffix="formParams.labelSuffix"
        :hide-required-asterisk="formParams.hideRequiredAsterisk"
        :show-message="formParams.showMessage"
        :inline-message="formParams.inlineMessage"
        :status-icon="formParams.statusIcon"
        :validate-on-rule-change="formParams.validateOnRuleChange"
        :size="formParams.size"
        :disabled="formParams.disabled"
    >
        <el-form-item
            v-for="(itemForm, key) in formParams.formList"
            :key="key"
            :prop="key"
            :label="itemForm.label"
            :label-width="itemForm.labelWidth"
            :style="itemForm.style"
            v-show="getOption(itemForm.isShow, true)"
        >
            <el-radio-group v-if="itemForm.type === 'radio'" v-model="formParams.data[key]">
                <el-radio
                    v-for="(radioOption, index) in itemForm.radioOptions"
                    :key="index"
                    :label="radioOption.value"
                >
                    {{ radioOption.text }}
                </el-radio>
            </el-radio-group>
            <el-checkbox
                v-if="itemForm.type === 'checkbox'"
                v-model="formParams.data[key]"
                :true-label="
                    itemForm.checkboxOption.trueLabel != undefined
                        ? itemForm.checkboxOption.trueLabel
                        : true
                "
                :false-label="
                    itemForm.checkboxOption.falseLabel != undefined
                        ? itemForm.checkboxOption.falseLabel
                        : false
                "
            >
                {{
                    itemForm.checkboxOption.label
                        ? itemForm.checkboxOption.label
                        : itemForm.checkboxOption
                }}
            </el-checkbox>
            <el-checkbox-group
                v-if="itemForm.type === 'checkboxGroup'"
                v-model="formParams.data[key]"
            >
                <el-checkbox
                    v-for="(checkboxOption, index) in itemForm.checkboxOptions"
                    :key="index"
                    :true-label="checkboxOption.trueLabel || true"
                    :false-label="checkboxOption.falseLabel || false"
                    :label="checkboxOption.label ? checkboxOption.label : checkboxOption"
                ></el-checkbox>
            </el-checkbox-group>
            <el-input
                v-if="['text', 'textarea'].includes(itemForm.type)"
                :type="itemForm.type"
                v-model="formParams.data[key]"
                :maxlength="itemForm.maxlength"
                :show-word-limit="!!itemForm.maxlength"
                :placeholder="itemForm.placeholder"
                :disabled="itemForm.disabled"
                :style="`${itemForm.width ? 'width:' + itemForm.width : ''}`"
                :rows="itemForm.rows"
                clearable
                :show-password="itemForm.isPassword"
            ></el-input>
            <el-input
                v-if="itemForm.type === 'number'"
                :type="'text'"
                v-model.number="formParams.data[key]"
                :maxlength="itemForm.maxlength"
                :show-word-limit="!!itemForm.maxlength"
                :placeholder="itemForm.placeholder"
                :disabled="itemForm.disabled"
                clearable
                :show-password="itemForm.isPassword"
            ></el-input>
            <el-input-number
                v-if="itemForm.type === 'input-number'"
                v-model="formParams.data[key]"
                :disabled="itemForm.disabled"
            ></el-input-number>
            <el-select
                v-if="itemForm.type === 'select'"
                v-model="formParams.data[key]"
                :multiple="itemForm.multiple"
                :multiple-limit="itemForm.multipleLimit"
                :style="`${itemForm.width ? 'width:' + itemForm.width : ''}`"
                clearable
                :placeholder="itemForm.placeholder"
                :disabled="itemForm.disabled"
                filterable
                @change="
                    () => {
                        itemForm.change && itemForm.change();
                    }
                "
            >
                <template v-if="itemForm.selectOptions[0] && itemForm.selectOptions[0].options">
                    <el-option-group
                        v-for="selectOption in itemForm.selectOptions"
                        :key="selectOption.label"
                        :label="selectOption.label"
                    >
                        <el-option
                            v-for="item in selectOption.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-option-group>
                </template>
                <template v-else>
                    <el-option
                        v-for="(selectOption, index) in itemForm.selectOptions"
                        :key="index"
                        :label="selectOption.label"
                        :value="selectOption.value"
                    ></el-option>
                </template>
            </el-select>
            <el-cascader
                v-if="itemForm.type === 'cascader'"
                v-model="formParams.data[key]"
                :options="itemForm.cascaderOptions"
                :disabled="itemForm.disabled"
                :placeholder="itemForm.placeholder"
                clearable
                filterable
            ></el-cascader>
            <el-switch
                v-if="itemForm.type === 'switch'"
                v-model="formParams.data[key]"
                :disabled="itemForm.disabled"
                :active-text="itemForm.activeText"
                :inactive-text="itemForm.inactiveText"
            ></el-switch>
            <el-slider
                v-if="itemForm.type === 'slider'"
                :disabled="itemForm.disabled"
                v-model="formParams.data[key]"
            ></el-slider>
            <el-time-select
                v-if="itemForm.type === 'time-select'"
                v-model="formParams.data[key]"
                :disabled="itemForm.disabled"
                :placeholder="itemForm.placeholder"
            ></el-time-select>
            <el-time-picker
                v-if="itemForm.type === 'time-picker'"
                v-model="formParams.data[key]"
                :placeholder="itemForm.placeholder"
                :disabled="itemForm.disabled"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :is-range="itemForm.isRange"
                :value-format="formParams.valueFormat"
            ></el-time-picker>
            <el-date-picker
                v-if="itemForm.type === 'date-picker'"
                :style="itemForm.style"
                v-model="formParams.data[key]"
                :disabled="itemForm.disabled"
                :placeholder="itemForm.placeholder"
                :picker-options="itemForm.pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :type="itemForm.mode"
                :value-format="itemForm.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                :default-time="itemForm.defaultTime"
            ></el-date-picker>
            <el-upload
                v-if="itemForm.type === 'upload'"
                ref="upload"
                :accept="itemForm.accept"
                :action="itemForm.action"
                :list-type="itemForm.listType"
                :disabled="itemForm.disabled"
                :auto-upload="itemForm.autoUpload ? itemForm.autoUpload : false"
                :file-list="itemForm.fileList"
                :before-remove="
                    (file, fileList) => {
                        beforeRemoveFile(file, fileList, itemForm.beforeRemoveFile);
                    }
                "
                :on-remove="
                    (file, fileList) => {
                        onFileRemove(file, fileList, itemForm.onFileRemove);
                    }
                "
                :http-request="itemForm.httpRequest"
                :limit="itemForm.limit || 1"
                :multiple="itemForm.limit && itemForm.limit != 1 ? true : false"
                :on-change="itemForm.onChange"
            >
                <i v-if="itemForm.listType === 'picture-card'" class="el-icon-plus"></i>
                <el-button
                    v-if="itemForm.listType === 'file-list'"
                    @click="
                        () => {
                            if (itemForm.limit == 1 || !itemForm.limit) {
                                onFileChange();
                            }
                        }
                    "
                    size="small"
                    type="primary"
                    :loading="itemForm.uploadLoading"
                >
                    选择文件
                </el-button>
                <span v-show="itemForm.uploadLoading">上传中...</span>
                <div v-if="itemForm.listType === 'file-list'" slot="tip" class="el-upload__tip">
                    {{ itemForm.tip ? itemForm.tip : "" }}
                </div>
            </el-upload>
            <el-rate
                v-if="itemForm.type === 'rate'"
                :disabled="itemForm.disabled"
                v-model="formParams.data[key]"
            ></el-rate>
            <el-color-picker
                v-if="itemForm.type === 'color-picker'"
                :disabled="itemForm.disabled"
                v-model="formParams.data[key]"
            ></el-color-picker>
            <el-transfer
                v-if="itemForm.type === 'transfer'"
                :disabled="itemForm.disabled"
                v-model="formParams.data[key]"
                :data="itemForm.transferData"
            ></el-transfer>
            <!-- id="richText" -->
            <div v-if="itemForm.type === 'richText'" :id="key" ref="richText"></div>
            <slot
                v-if="itemForm.type === 'customItem'"
                :name="itemForm.name ? itemForm.name : 'customItem'"
                :itemForm="itemForm"
                :formDate="formParams.data"
                :itemKey="key"
            ></slot>
        </el-form-item>
        <el-form-item v-if="formParams.submit">
            <el-button
                type="primary"
                @click="submitForm('easy-form', formParams.submit.submitFunction)"
            >
                {{ formParams.submit.submitText || "提交" }}
            </el-button>
            <el-button type="info" v-if="formParams.submit.reset" @click="resetForm('easy-form')">
                重置
            </el-button>
            <el-button
                type="info"
                v-if="formParams.submit.cancel"
                @click="cancelSubmit(formParams.submit.cancelFunction)"
            >
                {{ formParams.submit.cancelText || "取消" }}
            </el-button>
        </el-form-item>
        <slot name="buttonGroup"></slot>
    </el-form>
</template>

<script>
export default {
    name: "EasyForm",
    props: {
        formParams: {
            type: Object,
            default: function () {
                return {
                    data: {}, // 表单数据对象
                    formList: {
                        //text,textarea
                        //number
                        //input-number
                        //select
                        //time-select
                        //time-picker
                        //date-picker
                        //radio
                        //checkbox
                        //cascader
                        //switch
                        //slider
                        //upload
                        //rate
                        //color-picker
                        //transfer
                        //customItem
                        /* xxx: {
                            type: "text",
                            label: "xxxx",
                            placeholder: "请输入xxxx",
                        }, */
                    },
                    rules: {}, // 表单验证规则
                    inline: false, // 行内表单模式
                    labelPosition: "right", // 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width 可选值：right/left/top
                    labelWidth: "80px", // 表单域标签的宽度 支持 auto
                    labelSuffix: "", // 表单域标签的后缀
                    hideRequiredAsterisk: true, // 是否显示必填字段的标签旁边的红色星号
                    showMessage: true, // 是否显示校验错误信息
                    inlineMessage: false, // 是否以行内形式展示校验信息
                    statusIcon: false, // 是否在输入框中显示校验结果反馈图标
                    validateOnRuleChange: true, // 是否在 rules 属性改变后立即触发一次验证
                    size: "", // 用于控制该表单内组件的尺寸 可选值：medium / small / mini
                    disabled: false, // 是否禁用该表单内的所有组件
                    submit: {
                        submitFunction: () => {},
                        submitText: "", //提交按钮文字
                        cancel: false, // 是否显示取消按钮
                        cancelFunction: () => {},
                        cancelText: "", //取消按钮文字
                        reset: false, //是否可重置
                    },
                };
            },
            required: true,
        },
    },
    data() {
        return { editor: null, richTextId: "" };
    },
    methods: {
        //文件改变钩子函数
        onFileChange() {
            // console.log(this.$refs);
            this.$refs["upload"][0].clearFiles();
        },
        //删除文件列表中文件的钩子
        beforeRemoveFile(file, fileList, beforeRemoveFile) {
            console.log(file, fileList, beforeRemoveFile);
            let fileIndex = JSON.parse(JSON.stringify(fileList)).findIndex((item) => {
                return item.uid == file.uid;
            });
            beforeRemoveFile && beforeRemoveFile(fileIndex);
        },
        onFileRemove(file, fileList, formFileList) {
            console.log(file, fileList, formFileList);
        },
        //取消
        cancelSubmit(cancel) {
            cancel && cancel();
        },
        //提交表单
        submitForm(formName, submit) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    submit && submit();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //重置表单
        resetForm() {
            this.$refs["easy-form"].resetFields();
        },
        getOption(value, defaultValue) {
            return value === void 0 ? defaultValue : value;
        },
    },
    beforeDestroy() {},
    mounted() {},
};
</script>

<style scoped lang="scss">
.el-select,
.el-cascader,
.el-time-select,
.el-time-picker,
.el-date-picker {
    width: 100%;
}
.el-form {
    margin-top: 20px;
}
//行内表单
.el-form--inline {
    display: inline-block;
    ::v-deep .el-form-item__label-wrap {
        margin-left: 0 !important;
    }
}
#richText {
    z-index: 2000;
}
</style>
