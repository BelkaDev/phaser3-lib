import Compile from '../../../../math/expressionparser/utils/Complile.js';
import mustache from 'mustache';

export default {
    setData(key, value) {
        this.blackboard.setData(key, value);
        return this;
    },

    hasData(key) {
        return this.blackboard.hasData(key);
    },

    incData(key, inc) {
        this.blackboard.incData(key, inc);
        return this;
    },

    toggleData(key) {
        this.blackboard.toggleData(key);
        return this;
    },

    getData(key) {
        return this.blackboard.getData(key);
    },

    dumpData() {
        return this.blackboard.dump();
    },

    loadData(data) {
        this.blackboard.load(data);
        return this;
    },

    evalExpression(expression) {
        if (typeof (expression) === 'number') {
            return expression;
        }

        return Compile(expression)(this.memory);
    },

    renderString(template) {
        return mustache.render(template, this.memory);
    }

}