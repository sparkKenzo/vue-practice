const TableStore = function (table, initialState = {}) {
    if (!table) {
        throw new Error('table is required.')
    }
    this.table = table;
    this.states = {
        _columns: [],
        columns: [],
        data: null
    };
    for (let prop in initialState) {
        if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
            this.states[prop] = initialState[prop];
        }
    }
};
TableStore.prototype.updateColumns = function () {
    const states = this.states;
    const _columns = states._columns || [];
    states.columns = [].concat(_columns)
};
TableStore.prototype.mutations = {
    insertColumn (states, column, index, parent) {
        let array = states._columns;
        if (parent) {
            array = parent.children;
            if(!array) array = parent.children=[];
        }
        if (typeof (index) !== 'undefined') {
            array.splice(index, 0, column);
        } else {
            array.push(column)
        }
        if (this.table.$ready) {
            this.updateColumns(); // hack for dynamics insert column
        }
    },
    removeColumn (states, column, parent) {
        let array = states._columns;
        if (parent) {
            array = parent.children;
            if(!array) array = parent.children = [];
        }
        if (array) {
            array.splice(array.indexOf(column),1)
        }
        if (this.table.$ready) {
            this.updateColumns(); //hack for dynamics remove column
        }
    }
};
TableStore.prototype.commit = function (name, ...arg) {
    const mutations = this.mutations;
    if (mutations[name]) {
        mutations[name].apply(this,[this.states].concat(arg));
    } else {
        throw new Error(`Action not found: ${name}`);
    }
};
export default TableStore;