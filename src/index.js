function VueStoreBus(Vue, router) {
    // Bus & Stroe
    const mixin = {
        watch: {
            $route(to, from) {
                if (to.path !== from.path && from.path === this.currentStore.route) {
                    this.destroyNameSpace(this.currentStore.namespace);
                    this.currentStore.namespace = undefined;
                    this.currentStore.route = undefined;
                }
            }
        }
    };

    const bus = new Vue({
        router,
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
            createNameSpace(namespace) {
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

            destroyNameSpace(namespace) {
                if (typeof this.callbackStore[namespace] === 'object') {
                    for (const valName in this.callbackStore[namespace]) {
                        if (typeof this.callbackStore[namespace][valName] === 'function') {
                            this.callbackStore[namespace][valName]();
                        }
                    }
                }

                this.$delete(this.busStore, namespace);
                this.$delete(this.callbackStore, namespace);
            },

            getNameSpaceVal(namespace) {
                if (this.busStore[namespace] === undefined) {
                    console.error('Non-existing namespace!');
                } else {
                    return this.busStore[namespace];
                }
            },

            setVal(propertyName, val, destroyCallback = _ => { }) {
                const nameArr = propertyName.split('/');
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
                    destroyCallback = _ => { };
                }

                if (this.callbackStore[nameArr[0]][nameArr[1]] === undefined) {
                    this.$set(this.callbackStore[nameArr[0]], nameArr[1], destroyCallback);
                } else {
                    this.callbackStore[nameArr[0]][nameArr[1]] = destroyCallback;
                }
            },

            getVal(propertyName, defVal = undefined) {
                const nameArr = propertyName.split('/');
                if (nameArr && nameArr.lenght < 2) {
                    console.error('You must specify a namespace!');
                    return;
                }

                if (this.busStore[nameArr[0]] === undefined || this.busStore[nameArr[0]][nameArr[1]] === undefined) {
                    return defVal;
                }
                return this.busStore[nameArr[0]][nameArr[1]];
            },

            delVal(propertyName) {
                const nameArr = propertyName.split('/');
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

            getStore() {
                return this.busStore;
            },

            getCurrentStore() {
                return this.currentStore;
            }
        }
    });

    // Events
    Object.defineProperties(bus, {
        on: {
            get() {
                return this.$on.bind(this);
            }
        },
        once: {
            get() {
                return this.$once.bind(this);
            }
        },
        off: {
            get() {
                return this.$off.bind(this);
            }
        },
        emit: {
            get() {
                return this.$emit.bind(this);
            }
        }
    });

    Object.defineProperty(Vue, 'bus', {
        get() {
            return bus;
        }
    });

    Object.defineProperty(Vue.prototype, '$bus', {
        get() {
            return bus;
        }
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueStoreBus);
}

export default VueStoreBus;
