<template>
    <div></div>
</template>

<script>
let columnIdSeed = 1;

const defaults = {
    default: {
        order: ''
    },
    index: {
        width: 48,
        minWidth: 48,
        realWidth: 48,
        order: ''
    }
};

const forced = {
    index: {
        renderHeader: function (h, {column}) {
            return column.label || '#';
        },
        renderCell: function (h, {$index, column}) {
            let i = $index + 1;
            const index = column.index;
            if (typeof index === 'number') {
                i = $index + index;
            } else if (typeof index === 'function') {
                i = index($index);
            }
            return `<div>${i}<div>`;
        }
    }
};

const getDefaultColumn = function (type, options) {
    const column = {};
    Object.assign(column, defaults[type || 'default']);
    for (let name in options){
        if (options.hasOwnProperty(name)) {
            const value = options[name];
            if (typeof (value) !== 'undefined') {
                column[name] = value;
            }
        }
    }
    if (!column.minWidth) {
        column.minWidth = 80;
    }
    column.realWidth = column.width === undefined ? column.minWidth : column.width;

    return column;
};

const DEFAULT_RENDER_CELL = function (h, {row, column, $index}) {
    const property = column.property;
    const value = property && row[property];
    if (column && column.formatter) {
        return column.formatter(row, column, value, $index);
    } else {
        return value;
    }
};

const parseWidth = width => {
    if (width !== undefined) {
        width = parseInt(width, 10);
        if (isNaN(width)) {
            width = null;
        }
    }
    return width;
};

const parseMinWidth = minWidth => {
    if (minWidth !== undefined) {
        minWidth = parseInt(minWidth, 10);
        if (isNaN(minWidth)) {
            minWidth = 80;
        }
    }
    return minWidth;
};
export default {
    name: "kc-table-column",
    props: {
      type: {
        type: String,
        default: 'default'
      },
      label: String,
      prop: String,
      width: String,
      minWidth: {
          type: Object,
          default: function () {
              return {}
          }
      },
      formatter: Function,
      renderHeader: Function
    },
    data () {
        return {
            columns: []
        }
    },
    beforeCreate () {
        this.row = {};
        this.column = {};
        this.$index = 0;
    },
    computed:{
        owner () {
            let parent = this.$parent;
            while (parent && !parent.tableId) {
                parent = parent.$parent;
            }
            return parent;
        },
        columnOrTableParent () {
            let parent = this.$parent;
            while (parent && !parent.tableId && !parent.columnId) {
                parent = parent.$parent;
            }
            return parent;
        }
    },
    created () {
        let parent = this.columnOrTableParent;
        this.columnId = (parent.tableId || parent.columnId) +  '_column_' + columnIdSeed++;
        let type = this.type;
        const width = parseWidth(this.width);
        const minWidth = parseMinWidth(this.minWidth);
        let column = getDefaultColumn(type, {
            id: this.columnId,
            label: this.label,
            property: this.prop || this.property,
            type,
            width,
            minWidth,
            formatter: this.formatter,
            renderHeader: this.renderHeader,
            renderCell: null
        });
        let source = forced[type] || {};
        Object.keys(source).forEach(prop => {
            let value = source[prop];
            if (value !== undefined) {
                if (prop === 'renderHeader') {
                    if (type === 'selection' && column[prop]){
                        console.warn('[Element Warn][TableColumn]Selection column doesn\'t allow to set render-header function.');
                    } else {
                        value = column[prop] || value;
                    }
                }
                column[prop] = prop === 'className' ? `${column[prop]} ${value}` : value;
            }
        });
        this.columnConfig = column;

        let renderCell = column.renderCell;
        column.renderCell = function (h, data) {
            if (!renderCell) {
               renderCell=DEFAULT_RENDER_CELL;
            }
            const children = renderCell(h, data);
            return `${children}`;
        }
    },
    destroyed () {
        if(!this.$parent) return;
        this.owner.store.commit('removeColumn', this.columnConfig, null);
    },
    mounted () {
        const owner = this.owner;
        owner.store.commit('insertColumn', this.columnConfig);
    }
}
</script>