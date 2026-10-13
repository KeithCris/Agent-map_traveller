<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<style>
/* ===== Silver-Black Element Plus Overrides ===== */

/* Card — glass effect */
.el-card {
  border-radius: 1.5rem !important;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(16px) !important;
}

/* Primary button — silver gradient */
.el-button--primary {
  --el-button-bg-color: #6b6b6b;
  --el-button-border-color: #6b6b6b;
  --el-button-hover-bg-color: #8b8b8b;
  --el-button-hover-border-color: #8b8b8b;
  border-radius: 0.75rem !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 16px rgba(120, 120, 120, 0.35) !important;
  transition: all 0.3s !important;
}

.el-button--primary:hover {
  box-shadow: 0 6px 24px rgba(140, 140, 140, 0.5) !important;
  transform: translateY(-1px);
}

/* Default button */
.el-button {
  border-radius: 0.75rem !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: #c8c8c8 !important;
  font-weight: 500 !important;
  transition: all 0.2s !important;
}

.el-button:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(160, 160, 160, 0.4) !important;
  color: #e0e0e0 !important;
}

/* Text button */
.el-button.is-text {
  background: transparent !important;
  border-color: transparent !important;
}

/* Tag */
.el-tag {
  border-radius: 9999px !important;
}

/* Input */
.el-input__wrapper {
  border-radius: 0.75rem !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: none !important;
  transition: all 0.2s !important;
}

.el-input__wrapper:hover {
  border-color: rgba(160, 160, 160, 0.3) !important;
}

.el-input__wrapper.is-focus {
  border-color: #9e9e9e !important;
  box-shadow: 0 0 0 3px rgba(160, 160, 160, 0.15) !important;
}

/* Input inner text color */
.el-input__inner {
  color: #e0e0e0 !important;
}

.el-input__inner::placeholder {
  color: #808080 !important;
}

.el-select .el-input__wrapper {
  border-radius: 0.75rem !important;
}

.el-select-dropdown {
  background: rgba(20, 20, 20, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(16px) !important;
}

.el-select-dropdown__item {
  color: #c8c8c8 !important;
}

.el-select-dropdown__item.is-selected {
  background: rgba(160, 160, 160, 0.15) !important;
  color: #c0c0c0 !important;
}

.el-select-dropdown__item:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}

/* Date picker */
.el-date-editor.el-input__wrapper {
  border-radius: 0.75rem !important;
}

.el-picker-panel {
  background: rgba(20, 20, 20, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(16px) !important;
  color: #e0e0e0 !important;
}

/* Textarea */
.el-textarea__inner {
  border-radius: 0.75rem !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #e0e0e0 !important;
}

.el-textarea__inner:focus {
  border-color: #9e9e9e !important;
  box-shadow: 0 0 0 3px rgba(160, 160, 160, 0.15) !important;
}

.el-textarea__inner::placeholder {
  color: #808080 !important;
}

/* Dialog — glass */
.el-dialog {
  border-radius: 1.5rem !important;
  background: rgba(20, 20, 20, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(24px) !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5) !important;
}

.el-dialog__header {
  color: #e0e0e0 !important;
}

/* Drawer */
.el-drawer {
  background: rgba(20, 20, 20, 0.95) !important;
  backdrop-filter: blur(24px) !important;
  border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
}

/* Alert */
.el-alert {
  border-radius: 0.75rem !important;
}

.el-alert--info {
  background: rgba(160, 160, 160, 0.08) !important;
  border: 1px solid rgba(160, 160, 160, 0.15) !important;
}

/* Radio */
.el-radio {
  height: auto !important;
  color: #c8c8c8 !important;
}

.el-radio.is-checked .el-radio__inner {
  border-color: #a0a0a0 !important;
  background: #a0a0a0 !important;
}

.el-radio__label {
  color: #c8c8c8 !important;
}

/* Slider */
.el-slider__bar {
  height: 6px !important;
  background: linear-gradient(90deg, #888, #aaa, #999, #bbb) !important;
}

.el-slider__runway {
  height: 6px !important;
  border-radius: 3px !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

.el-slider__button {
  width: 20px !important;
  height: 20px !important;
  border: 2px solid #a0a0a0 !important;
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(160, 160, 160, 0.4) !important;
}

/* Progress */
.el-progress-bar__outer {
  border-radius: 3px !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

/* Radio button group */
.el-radio-button__inner {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  color: #c8c8c8 !important;
}

.el-radio-button.is-active .el-radio-button__inner {
  background: rgba(160, 160, 160, 0.2) !important;
  border-color: #9e9e9e !important;
  color: #c0c0c0 !important;
}

/* Form label */
.el-form-item__label {
  color: #a0a0a0 !important;
  font-weight: 500 !important;
}

/* Divider */
.el-divider {
  border-color: rgba(255, 255, 255, 0.06) !important;
}

/* Empty */
.el-empty__description p {
  color: #808080 !important;
}

/* Loading color */
.el-loading-spinner .circular circle {
  stroke: #a0a0a0 !important;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
