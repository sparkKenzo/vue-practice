<template>
  <div class="home">
    <kc-table :data="data">
        <kc-table-column type="index" label="序号" :renderHeader="formatHeader"></kc-table-column>
        <kc-table-column label="姓名" prop="name" width="200"></kc-table-column>
        <kc-table-column label="年龄" prop="age" :formatter="formatAge"></kc-table-column>
    </kc-table>
  </div>
</template>

<script>
// @ is an alias to /src
import KcTable from '@/components/kc-table/kc-table'
import KcTableColumn from '@/components/kc-table/kc-table-column'

export default {
  name: 'home',
  components: {
    KcTable,
    KcTableColumn
  },
  data () {
      return {
          data: [
              {
                  id: 1,
                  name: 'chen',
                  age: 18
              }
          ]
      }
  },
  methods: {
      formatAge (row, column) {
          let res = row[column.property];
          return `<span>${++res}</span>`;
      },
      formatHeader (row, data) {
          return `<span>${data.column.label}</span>`;
      }
  }
}
</script>
