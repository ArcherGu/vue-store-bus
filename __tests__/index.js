/* global test expect */
const Vue = require('vue')
const VueStoreBus = require('../dist/vue-store-bus.common')

Vue.use(VueStoreBus)

test('Vue.bus', () => {
    const vm = new Vue({
        data() {
            return { count: 0 }
        },
        created() {
            Vue.bus.on('add', num => { this.count += num })
            Vue.bus.once('addOnce', num => { this.count += num })
        },
        methods: {
            clean() {
                Vue.bus.off('add')
            }
        }
    })

    const obj = {
        fire() {
            Vue.bus.emit('add', 1)
        },
        fireOnce() {
            Vue.bus.emit('addOnce', 1)
        }
    }

    obj.fire()
    expect(vm.count).toBe(1)

    obj.fire()
    expect(vm.count).toBe(2)

    vm.clean()
    obj.fire()
    expect(vm.count).toBe(2)

    obj.fireOnce()
    expect(vm.count).toBe(3)

    obj.fireOnce()
    expect(vm.count).toBe(3)
})
