let columnIdSeed = 1;

const defaults = {
    default: {
        order: ''
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
    name: 'KcTableColumn',
    props: {
        type: {
            type: String,
            default: 'default'
        },
        label: String,
        prop: String,
        width: {},
        minWidth: {}
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
        }
    },
    created () {
        // let owner = this.owner;
        this.columnId = 'column_' + columnIdSeed++;
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
            renderCell: null
        });
        this.columnConfig = column;

        // let renderCell = column.renderCell;
        column.renderCell = function () {
            return "cell"
        }
    },
    mounted () {
        const owner = this.owner;
        owner.store.commit('insertColumn', this.columnConfig);
    }
}