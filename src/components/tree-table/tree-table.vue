<template>
  <div class="ignore-vw tree-table-wrapper">
    <table class="tree-table" cellspacing="0" cellpadding="0" border="0">
      <thead>
        <tr>
          <th v-for="(column,index) of columns" :key="index" :style="column.style">
            <div class="cell">
              {{column.title}}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="tree-table__row" v-for="(row,index) of showTreeData" :key="index" v-show="row.show">
          <td v-for="(column,index) of columns" :key="index" :style="column.style">
            <div class="cell">
              <div class="tree-table__expand-icon" v-if="index === 0 && row.hasChildren">
                <i class="el-icon-arrow-right" @click="expandRow(row)" v-if="row.expanded === 0"></i>
                <i class="el-icon-arrow-down" @click="foldRow(row)" v-else-if="row.expanded === 1"></i>
                <i class="el-icon-loading" v-else></i>
              </div>
              <slot :name="column.slot_name" :row="row" v-if="column.slot_name"></slot>
              <span v-else>{{row[column.prop]}}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-data" v-if="showTreeData.length === 0">暂无数据</div>
  </div>
</template>

<script>
export default {
  name: 'tree-table',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    load: Function
  },
  data () {
    return {
      treeData: [],
      showTreeData: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler: function (newVal) {
        this.treeData = newVal.map(item => {
          item.show = true
          item.children = []
          item.hasChildren = true
          item.loaded = false
          item.expanded = 0
          return item
        })
      }
    },
    treeData: {
      immediate: true,
      deep: true,
      handler: function (newVal) {
        const arr = []
        newVal.forEach(row => {
          arr.push(row)
          if (row.children && row.children.length > 0) {
            row.children.forEach(item => {
              item.child = true
              item.show = row.expanded === 1
              arr.push(item)
            })
          }
        })
        this.showTreeData = [...arr]
      }
    }
  },
  methods: {
    async expandRow (row) {
      if (!row.loaded) {
        row.expanded = -1
        this.treeData = [...this.treeData]
        const p = new Promise(resolve => {
          this.load(row, resolve)
        })
        p.then(data => {
          row.children = data
          row.loaded = true
          row.expanded = 1
          this.treeData = [...this.treeData]
        })
      } else {
        row.expanded = 1
        this.treeData = [...this.treeData]
      }
    },
    foldRow (row) {
      row.expanded = 0
      this.treeData = [...this.treeData]
    }
  }
}
</script>

<style scoped lang="scss">
.ignore-vw{
  &.tree-table-wrapper{
    width: 100%;
    .tree-table{
      width: 100%;
      th,td{
        padding: 6px 0;
        white-space: nowrap;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        .cell{
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
        }
      }
      th{
        background: #fff;
      }
      td{
        background: #f7f7f7;
      }
      .tree-table__expand-icon{
        display: inline-block;
        margin-right: 5px;
        padding: 5px;
      }
    }
    .no-data{
      line-height: 40px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
