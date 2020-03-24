/*!
 * vue-store-bus v1.0.0
 * https://github.com/yangmingshan/vue-bus
 * @license MIT
 */
'use strict';

function VueStoreBus(Vue, router) {
    //Bus & Stroe
    var mixin = {
        watch: {
            $route: function $route(to, from) {
                if (to.path !== from.path && from.path === this.currentStore.route) {
                    this.destroyNameSpace(this.currentStore.namespace);
                    this.currentStore.namespace = undefined;
                    this.currentStore.route = undefined;
                }
            }
        },
    };

    var bus = new Vue({
        router: router,
        mixins: typeof router === 'object' ? [mixin] : [],
        data: {
            busStore: {},
            currentStore: {
                namespace: undefined,
                route: undefined
            }
        },
        methods: {
            createNameSpace: function createNameSpace(namespace) {
                if (this.busStore[namespace] === undefined) {
                    this.$set(this.busStore, namespace, {});
                    if (typeof this.$route === 'object') {
                        this.currentStore.namespace = namespace;
                        this.currentStore.route = this.$route.path;
                    }
                }
            },

            destroyNameSpace: function destroyNameSpace(namespace) {
                this.$delete(this.busStore, namespace);
            },

            getNameSpaceVal: function getNameSpaceVal(namespace) {
                if (this.busStore[namespace] === undefined) {
                    console.error('不存在的命名空间！');
                    return undefined;
                }
                else {
                    return this.busStore[namespace];
                }
            },

            setVal: function setVal(propertyName, val) {
                var nameArr = propertyName.split("/");
                if (nameArr && nameArr.lenght < 2) {
                    console.error('你必须指定一个命名空间！');
                    return false;
                }
                if (this.busStore[nameArr[0]] === undefined) {
                    this.createNameSpace(nameArr[0]);
                }

                if (this.busStore[nameArr[0]][nameArr[1]] === undefined) {
                    this.$set(this.busStore[nameArr[0]], nameArr[1], val);
                }
                else {
                    this.busStore[nameArr[0]][nameArr[1]] = val;
                }
            },

            getVal: function getVal(propertyName, defVal) {
                if ( defVal === void 0 ) defVal = undefined;

                var nameArr = propertyName.split("/");
                if (nameArr && nameArr.lenght < 2) {
                    console.error('你必须指定一个命名空间！');
                    return false;
                }

                if (this.busStore[nameArr[0]] === undefined || this.busStore[nameArr[0]][nameArr[1]] === undefined) {
                    return defVal;
                }
                return this.busStore[nameArr[0]][nameArr[1]];
            },

            delVal: function delVal(propertyName) {
                var nameArr = propertyName.split("/");
                if (nameArr && nameArr.lenght < 2) {
                    console.error('你必须指定一个命名空间！');
                    return false;
                }

                if (this.busStore[nameArr[0]] === undefined) {
                    console.error('不存在的命名空间！');
                    return false;
                }

                this.$delete(this.busStore[nameArr[0]], nameArr[1]);
            },

            getStore: function getStore() {
                return this.busStore;
            },
        }
    });

    //Events
    Object.defineProperties(bus, {
        on: {
            get: function get() {
                return this.$on.bind(this)
            }
        },
        once: {
            get: function get() {
                return this.$once.bind(this)
            }
        },
        off: {
            get: function get() {
                return this.$off.bind(this)
            }
        },
        emit: {
            get: function get() {
                return this.$emit.bind(this)
            }
        }
    });

    Object.defineProperty(Vue, 'bus', {
        get: function get() {
            return bus
        }
    });

    Object.defineProperty(Vue.prototype, '$bus', {
        get: function get() {
            return bus
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueStoreBus);
}

module.exports = VueStoreBus;
