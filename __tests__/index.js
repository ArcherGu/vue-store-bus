/* global test expect */
const Vue = require('vue');
const VueStoreBus = require('../dist/vue-store-bus.common');

Vue.use(VueStoreBus);

test('Vue.bus', () => {
    const vm = new Vue({
        data() {
            return {
                count: 0,
                isDestroy: false
            };
        },
        created() {
            Vue.bus.on('add', num => { this.count += num; });
            Vue.bus.once('addOnce', num => { this.count += num; });
            Vue.bus.setVal('test/testObj', this.testObj);
            Vue.bus.setVal('test/myValue', 1, _ => this.isDestroy = true);
        },

        methods: {
            clean() {
                Vue.bus.off('add');
            },

            getValue() {
                return Vue.bus.getVal('test/storeValue');
            }
        }
    });

    const obj = {
        fire() {
            Vue.bus.emit('add', 1);
        },
        fireOnce() {
            Vue.bus.emit('addOnce', 1);
        },
        setValue() {
            Vue.bus.setVal('test/storeValue', 1);
        },
        delValue() {
            Vue.bus.delVal('test/myValue');
        }
    };

    obj.fire();
    expect(vm.count).toBe(1);

    obj.fire();
    expect(vm.count).toBe(2);

    vm.clean();
    obj.fire();
    expect(vm.count).toBe(2);

    obj.fireOnce();
    expect(vm.count).toBe(3);

    obj.fireOnce();
    expect(vm.count).toBe(3);

    obj.setValue();
    expect(vm.getValue()).toBe(1);

    obj.delValue();
    expect(vm.isDestroy).toBe(true);
});
