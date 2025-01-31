# EchoX: UI = f(DOM, Reactive)

<img src="./docs/public/logo.svg" width="100"/>

The lightweight reactive UI framework for declarative DOM manipulation, alternative to React, Vue and jQuery for small projects.

```js
import {html, reactive, $} from "echox";

const [scope] = reactive()
  .let("value", 0)
  .derive("double", (d) => d.value * 2)
  .observe((d) => console.log(d.value, d.double))
  .join();

const counter = html.div([
  html.button({onclick: () => scope.value++}, ["👍"]),
  html.button({onclick: () => scope.value--}, ["👍"]),
  html.span([$(() => scope.double)]),
]);

document.body.appendChild(counter);
```

## Resources 📚

- Documentation - https://echox.dev/
- Features - https://echox.dev/what-is-echox
- Motivation - https://echox.dev/why-is-echox

## License 📄

MIT@Bairui SU
