# vue-store-bus
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArcherGu%2Fvue-store-bus.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FArcherGu%2Fvue-store-bus?ref=badge_shield)


A event bus with store for Vue.js, support Vue 2.x.

## Installation

You can install it via [yarn](https://yarnpkg.com) or [npm](https://npmjs.com).

```
$ yarn add vue-store-bus
$ npm install vue-store-bus --save
```

Install the bus via Vue.use():

```js
import Vue from "vue";
import VueStoreBus from "vue-store-bus";

Vue.use(VueStoreBus);
```

Add [vue-router](https://router.vuejs.org/) instance, the value in the store will be destroyed automatically when the route changes.

```js
Vue.use(VueStoreBus, router);
```

## Usage

### Event

#### Listen and clean

```js
// ...
created() {
  this.$bus.on('add-todo', this.addTodo);
  this.$bus.once('once', () => console.log('This listener will only fire once'));
},
beforeDestroy() {
  this.$bus.off('add-todo', this.addTodo);
},
methods: {
  addTodo(newTodo) {
    this.todos.push(newTodo);
  }
}
```

#### Trigger

```js
// ...
methods: {
  addTodo() {
    this.$bus.emit('add-todo', { text: this.newTodoText });
    this.$bus.emit('once');
    this.newTodoText = '';
  }
}
```

_Note: `on` `once` `off` `emit` are aliases for `$on` `$once` `$off` `$emit`. See the [API](https://vuejs.org/v2/api/#Instance-Methods-Events) for more detail._

### Store

#### Set

Create a namespace and store values under that namespace

```js
// ...
methods: {
  setValToStore() {
    this.$bus.setVal('myNamespace/myVal', 5)
  }
},
```

Since version 1.1.0, you can also set a callback function, This function will be called before this value is destroyed.
For example, if you store a class in the store and want to trigger its destructor when the class is destroyed.
**Note: Due to scope, you may need closure or bind callback to this.**

```js
// ...
methods: {
  setClassToStore() {
    // e.g myClass
    this.$bus.setVal('myNamespace/myClass', myClass, _ => { myClass.destroy() })
  }
},
```

#### Get

```js
// ...
computed: {
  myVal() {
    return this.$bus.getVal('myNamespace/myVal', 0)
  }
},
```

_Note: You can set a default value if the specified value cannot be obtained._

## License

[MIT](https://opensource.org/licenses/MIT)


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArcherGu%2Fvue-store-bus.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FArcherGu%2Fvue-store-bus?ref=badge_large)