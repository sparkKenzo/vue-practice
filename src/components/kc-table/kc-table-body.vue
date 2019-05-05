<template>
    <table class="kc-table__body" cellspacing="0" cellpadding="0" border="0">
        <colgroup>
            <col v-for="column of columns" :key="column.id" :name="column.id" :width="column.width">
        </colgroup>
        <tbody>
            <tr v-for="(row,$index) of rows" :key="row.id">
                <td v-for="column of columns" :key="column.id">
                    <div class="cell" v-html="column.renderCell('h',{row, column, $index})"></div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "kc-table-body",
        props: {
            store: {
                required: true
            },
            stripe: Boolean
        },
        computed: {
            data() {
                return this.store.states.data
            },
            rows() {
                return this.store.states.data
            },
            columns() {
                return this.store.states.columns
            }
        }
    }
</script>
