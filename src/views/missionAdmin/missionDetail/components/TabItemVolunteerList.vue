<template>
  <div class="list">
    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data-source="teamMembers"
      class="table"
    >
      <span slot="sex" slot-scope="text">
        {{ text && (text === 1 ? '男' : '女') || '' }}
      </span>
      <span slot="online" slot-scope="text, record">
        <a-badge v-if="checkOnline(record)" color="green" text="在线" />
        <a-badge v-else color="grey" text="离线" />
      </span>
      <span slot="equipment" slot-scope="text">
        {{ text && (text === 1 ? '齐全' : '不齐全') || '' }}
      </span>
    </a-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['teamMembers', 'onlineMembers'])
  },
  data () {
    return {
      columns: [
        {
          title: '用户 ID',
          dataIndex: 'volunteerInformation.id'
        },
        {
          title: '姓名',
          dataIndex: 'volunteerInformation.name'
        },
        {
          title: '性别',
          dataIndex: 'volunteerInformation.sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '在线状态',
          dataIndex: 'online',
          scopedSlots: { customRender: 'online' }
        },
        {
          title: '交通方式',
          dataIndex: 'volunteerCase.traffic'
        },
        {
          title: '装备状态',
          dataIndex: 'volunteerCase.equipment',
          scopedSlots: { customRender: 'equipment' }
        }
      ]
    }
  },
  methods: {
    checkOnline (volunteer) {
      return this.onlineMembers.some(ele => {
        return ele.id === volunteer.id
      })
    }
  }
}
</script>
