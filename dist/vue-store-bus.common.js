/*!
 * vue-store-bus v1.1.0
 * https://github.com/ArcherGu/vue-store-bus.git
 * @license MIT
 */
'use strict';

function VueStoreBus(Vue, router) {
    // Bus & Stroe
    var mixin = {
        watch: {
            $route: function $route(to, from) {
                if (to.path !== from.path && from.path === this.currentStore.route) {
                    this.destroyNameSpace(this.currentStore.namespace);
                    this.currentStore.namespace = undefined;
                    this.currentStore.route = undefined;
                }
            }
        }
    };

    var bus = new Vue({
        router: router,
        mixins: typeof router === 'object' ? [mixin] : [],
        data: {
            busStore: {},
            callbackStore: {},
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

                if (this.callbackStore[namespace] === undefined) {
                    this.$set(this.callbackStore, namespace, {});
                }
            },

            destroyNameSpace: function destroyNameSpace(namespace) {
                if (typeof this.callbackStore[namespace] === 'object') {
                    for (var valName in this.callbackStore[namespace]) {
                        if (typeof this.callbackStore[namespace][valName] === 'function') {
                            this.callbackStore[namespace][valName]();
                        }
                    }
                }

                this.$delete(this.busStore, namespace);
                this.$delete(this.callbackStore, namespace);
            },

            getNameSpaceVal: function getNameSpaceVal(namespace) {
                if (this.busStore[namespace] === undefined) {
                    console.error('Non-existing namespace!');
                } else {
                    return this.busStore[namespace];
                }
            },

            setVal: function setVal(propertyName, val, destroyCallback) {
                if ( destroyCallback === void 0 ) destroyCallback = function (_) { };

                var nameArr = propertyName.split('/');
                if (nameArr && nameArr.lenght < 2) {
                    console.error('You have to add a namespace!');
                    return;
                }
                if (this.busStore[nameArr[0]] === undefined || this.callbackStore[nameArr[0]] === undefined) {
                    this.createNameSpace(nameArr[0]);
                }

                if (this.busStore[nameArr[0]][nameArr[1]] === undefined) {
                    this.$set(this.busStore[nameArr[0]], nameArr[1], val);
                } else {
                    this.busStore[nameArr[0]][nameArr[1]] = val;
                }

                if (typeof destroyCallback !== 'function') {
                    destroyCallback = function (_) { };
                }

                if (this.callbackStore[nameArr[0]][nameArr[1]] === undefined) {
                    this.$set(this.callbackStore[nameArr[0]], nameArr[1], destroyCallback);
                } else {
                    this.callbackStore[nameArr[0]][nameArr[1]] = destroyCallback;
                }
            },

            getVal: function getVal(propertyName, defVal) {
                if ( defVal === void 0 ) defVal = undefined;

                var nameArr = propertyName.split('/');
                if (nameArr && nameArr.lenght < 2) {
                    console.error('You must specify a namespace!');
                    return;
                }

                if (this.busStore[nameArr[0]] === undefined || this.busStore[nameArr[0]][nameArr[1]] === undefined) {
                    return defVal;
                }
                return this.busStore[nameArr[0]][nameArr[1]];
            },

            delVal: function delVal(propertyName) {
                var nameArr = propertyName.split('/');
                if (nameArr && nameArr.lenght < 2) {
                    console.error('You must specify a namespace!');
                    return;
                }

                if (this.busStore[nameArr[0]] === undefined) {
                    console.error('Non-existing namespace!');
                    return;
                }

                if (
                    typeof this.callbackStore[nameArr[0]] === 'object' &&
                    typeof this.callbackStore[nameArr[0]][nameArr[1]] === 'function'
                ) {
                    this.callbackStore[nameArr[0]][nameArr[1]]();
                }

                this.$delete(this.busStore[nameArr[0]], nameArr[1]);
                this.$delete(this.callbackStore[nameArr[0]], nameArr[1]);
            },

            getStore: function getStore() {
                return this.busStore;
            },

            getCurrentStore: function getCurrentStore() {
                return this.currentStore;
            }
        }
    });

    // Events
    Object.defineProperties(bus, {
        on: {
            get: function get() {
                return this.$on.bind(this);
            }
        },
        once: {
            get: function get() {
                return this.$once.bind(this);
            }
        },
        off: {
            get: function get() {
                return this.$off.bind(this);
            }
        },
        emit: {
            get: function get() {
                return this.$emit.bind(this);
            }
        }
    });

    Object.defineProperty(Vue, 'bus', {
        get: function get() {
            return bus;
        }
    });

    Object.defineProperty(Vue.prototype, '$bus', {
        get: function get() {
            return bus;
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueStoreBus);
}

module.exports = VueStoreBus;
