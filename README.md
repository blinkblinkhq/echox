# EchoX: UI = f(DOM, Reactive)

<img src="./docs/public/logo.png" width="100"/>

> [!NOTE]
> Work in progress. The APIs are not stable right now.

A lightweight reactive UI framework for declarative DOM manipulation, alternative to React, Vue and jQuery for small projects.

```js
import {html, reactive} from "echox";

const [state] = reactive()
  .state("value", 0)
  .computed("double", (d) => d.value * 2)
  .effect((d) => console.log(d.value, d.double))
  .join();

const counter = html.div([
  html.button({onclick: () => state.value++}, ["👍"]),
  html.button({onclick: () => state.value--}, ["👎"]),
  html.span([() => state.double]),
]);

document.body.appendChild(counter);
```

## Resources 📚

- Documentation - https://echox.dev/
- Features - https://echox.dev/docs/what-is-echox
- Motivation - https://echox.dev/docs/why-is-echox

## License 📄

MIT@Bairui SU
