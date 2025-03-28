# What is EchoX?

**EchoX** is a lightweight reactive UI framework for declarative DOM manipulation, offering a simple and efficient alternative to [React](https://react.dev/), [Vue](https://vuejs.org/), and [jQuery](https://jquery.com/), especially for small projects. 

It works out of the box without the need for compilation or transpilation while still providing the following benefits:

- Fine-grained interactivity
- Readable template
- Fully TypeScript support

The philosophy for EchoX is **UI = f(DOM, Reactive)**, and [APIs](/docs/api-index) are designed based on this.

## Functional UI Construction

EchoX provides a declarative way to building user interfaces with pure function calls, without compilation like JSX (used in React), and with full TypeScript support over string-based templates, portable and readable (used in Vue and Alpine).

A _html_ proxy object exported to build nested UI.For example, let's create a counter:

```js
html.div([
  html.button({style: "background: blue"}, ["👍"]),
  html.button({style: "background: red"}, ["👎"]),
  html.span([0]),
]);
```

Please refer to [EchoX DOM](/docs/echox-dom) from more information.

## Native DOM Manipulation

Operates directly on the native DOM instead of relying on a virtual DOM, achieving higher performance and lower memory overhead while maintaining simplicity.

The _html_ proxy object **create native DOM directly**. This is the _DOM_ in the philosophy. For example, to create a hello world message:

```js
// The dom variable is a native DOM, not a virtual dom!!!
const dom = html.span({style: "font-size: 10"}, ["hello World"]);

// So you can directly append dom to the DOM tree!
container.appendChild(dom);
```

## Granular State Observation

Apply fine-grained state observation, allowing independently update, minimizing unnecessary DOM updates and improves performance compared to virtual DOM-based frameworks. (Similar to [SolidJS](https://www.solidjs.com/))

EchoX exports one method _reactive_ for reactivity. For example, let's make the counter interactive:

```js
const [scope] = ex
  .reactive()
  .state("value", 0)
  .computed("double", (d) => d.value * 2)
  .effect((d) => console.log(d.value, d.double))
  .join();

const dom = html.div([
  html.button({onclick: () => scope.value++}, ["👍"]),
  html.button({onclick: () => scope.value--}, ["👎"]),
  html.span([() => state.double]),
]);
```

_EchoX.reactive_ returns a reactive scope, where stores the states you defined. Then you can bind states with the attributes or child nodes of DOMs using _use_. This is the _reactive_ in the philosophy.

Please refer to [EchoX Reactive](/docs/echox-reactive) for more information.

## What's more?

That's all! But maybe server side rendering (SSR) in the future?
