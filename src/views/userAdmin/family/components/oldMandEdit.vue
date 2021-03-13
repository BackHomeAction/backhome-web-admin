<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="32" type="flex" align-item="center">
        <page-go-back-top @back="goBack" ><a style="color: #999999;margin-top: 5px;font-size: 15px" ><a-icon type="left" /><span>返回</span></a></page-go-back-top>
      </a-row>
      <a-form-model layout="inline" :label-col="{ span : 0 }" :wrapper-col="{ span : 0 }" >
        <a-row :gutter="32" type="flex" justufy="space-between" >
          <a-col :span="4" >
            <a-form-model-item>
              <a-avatar :size="150" shape="square" style='margin-left: 40px'><a-icon type="plus" />上传证件照</a-avatar>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="姓名:" >
              <a-input :placeholder="inLineText"></a-input>
            </a-form-model-item>

            <a-form-model-item label="手机号:" >
              <a-input :placeholder="inLineText"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="身份证号:" >
              <a-input :placeholder="inLineText"></a-input>
            </a-form-model-item>

            <a-form-model-item label="性别:" >
              <a-radio-group :default-value="1" >
                <a-radio :value="0">
                  男
                </a-radio>
                <a-radio :value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <a-form-model-item label="出生日期:" >
              <a-input :placeholder="inLineText"></a-input>
            </a-form-model-item>

            <a-form-model-item label="地区:" >
              <region-selector v-model="region" ></region-selector>
            </a-form-model-item>
          </a-col>
          <a-col :span="5" >
            <!--          位置的问题到时候再说-->
            <a-form-model-item label="家庭住址:" >
              <a-input :placeholder="inLineText" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="32" type="flex" style='margin-top: 15px'>
          <a-col :span="24" >
            <a-avatar :size="150" shape="square" style="margin-right:20px"></a-avatar>
            <a-avatar :size="150" shape="square" style="margin-right: 20px"></a-avatar>
            <a-button type="dashed" ><a-icon type="plus" />添加生活照</a-button>
          </a-col>
        </a-row>
        <a-row style="margin-top: 30px" >
          <a-table :columns="colmuns">
            <div slot="action" >
              <a>编辑</a>
              <a-divider type="vertical" />
              <a>删除</a>
            </div>
          </a-table>
        </a-row>
      </a-form-model>
      <a-row :gutter="32" >
        <a-button type="dashed" block style="margin-top: 5px">
          <a-icon type="plus" />新增常去地点
        </a-button>
      </a-row>
      <a-row :gutter="32" type="flex" justify="center" style="display: flex;align-items: center;margin-top: 15px" >
        <div>
          <a-button type="primary" style="margin-right: 35px;margin-top: 30px">保存</a-button>
          <a-button style="margin-left: 35px;margin-top: 30px;" >Default</a-button>
        </div>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { PageGoBackTop, RegionSelector } from '@/components'
export default {
  name: 'OldMandEdit',
  data () {
    return {
      inLineText: '请输入',
      region: ['天津市', '天津市', '河北区'],
      colmuns: [
        {
          title: '常去地点',
          dataIndex: 'where',
          width: '250px'
        },
        {
          title: '位置',
          dataIndex: 'address',
          width: '250px'
        },
        {
          title: '操作',
          dataIndex: 'where',
          scopedSlots: { customRender: 'action' }
        }
      ],
      datas: [
        {
          where: '天津工业大学',
          address: '滨海西道399号'
        },
        {
          where: '天津理工大学',
          address: '滨海南道399号'
        },
        {
          where: '天津师范大学',
          address: '滨海东道399号'
        }
      ]
    }
  },
  components: {
    PageGoBackTop, RegionSelector
  }
}
</script>

<style scoped>

</style>
