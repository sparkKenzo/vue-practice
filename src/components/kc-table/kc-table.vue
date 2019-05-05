<template>
    <div class="kc-table">
        <div class="hiddenColumns"><slot></slot></div>
        <div class="kc-table__header-wrapper">
            <table-header :store="store"></table-header>
        </div>
        <div class="kc-table__body-wrapper">
            <table-body :store="store"
                :stripe="stripe">
            </table-body>
            <div v-if="!data || data.length === 0"
                class="kc-table__empty-block">
                <span class="kc-table__empty-text">
                    <slot name="empty">{{emptyText}}</slot>
                </span>
            </div>
            <div v-if="$slots.append"
                class="kc-table__append-wrapper">
                <slot name="append"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import TableStore from './table-store'
import TableHeader from './kc-table-header'
import TableBody from './kc-table-body'

let tableIdSeed = 1;

export default {
    name: "kc-table",
    components: {
        TableHeader,
        TableBody
    },
    props: {
      data: {
          type: Array,
          default: function () {
              return [];
          }
      }
    },
    data ()  {
        const store = new TableStore(this,{data: this.data});
        return {
            store,
            stripe: true,
            emptyText: '暂无更多',
        }
    },
    computed: {
      columns () {
          return this.store.states.columns;
      }
    },
    created () {
        this.tableId = 'kc-table_' + tableIdSeed++;
    },
    mounted () {
        this.store.updateColumns();
        this.$ready = true;
    }
}
</script>

<style scoped>

</style>