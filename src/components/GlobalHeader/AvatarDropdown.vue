<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'" class="antd-pro-global-header-index-avatar" />
      <span>{{ currentUser.name }}</span>
      <a-modal
        title="修改密码"
        :visible="showModifyPasswordModal"
        :confirm-loading="isModifingPassword"
        @ok="handleModifyPassword"
        @cancel="showModifyPasswordModal = false"
      >
        <a-form-model ref="form" :model="modifyPasswordForm" :rules="rules" v-bind="layout">
          <a-form-model-item has-feedback label="旧密码" prop="oldPassword">
            <a-input v-model="modifyPasswordForm.oldPassword" type="password" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="新密码" prop="newPassword">
            <a-input v-model="modifyPasswordForm.newPassword" type="password" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="重复新密码" prop="confirmPassword">
            <a-input v-model="modifyPasswordForm.confirmPassword" type="password" autocomplete="off" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="settings" @click="showModifyPasswordModal = true">
          <a-icon type="setting" />
          修改密码
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { changePassword } from '@/api/login'
import { mapGetters } from 'vuex'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  data () {
    return {
      modifyPasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, trigger: ['blur', 'change'], message: '请输入旧密码' }],
        newPassword: [{ required: true, trigger: ['blur', 'change'], message: '请输入新密码' }],
        confirmPassword: [{ required: true, validator: this.validateConfirmPassword, trigger: ['blur', 'change'] }]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      showModifyPasswordModal: false,
      isModifingPassword: false
    }
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    },
    handleModifyPassword () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isModifingPassword = true
          try {
            await changePassword({
              oldPassword: this.modifyPasswordForm.oldPassword,
              newPassword: this.modifyPasswordForm.newPassword
            })
            this.$notification.success({
              message: '修改密码成功',
              description: '请重新登录'
            })
            this.$store.dispatch('Logout').then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
          } catch (e) {
            console.log(e)
          }
          this.isModifingPassword = false
        } else {
          return false
        }
      })
    },
    validateConfirmPassword (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.modifyPasswordForm.newPassword) {
        callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
