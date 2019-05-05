<template>
    <table class="kc-table__header" cellspacing="0" cellpadding="0" border="0">
        <colgroup>
            <col v-for="column of columns" :key="column.id" :name="column.id" :width="column.width">
        </colgroup>
        <thead>
            <tr>
                <th v-for="column of columns"
                    :key="column.id"
                    v-html="column.renderHeader ? column.renderHeader('h', {column}) : column.label">
                </th>
            </tr>
        </thead>
    </table>
</template>

<script>
    export default {
        name: "kc-table-header",
        props: {
            store: {
                required: true
            }
        },
        computed: {
            columns () {
                return this.store.states.columns;
            }
        },
        created () {
            console.log(this.store)
        }
    }
</script>

<style scoped>

</style>