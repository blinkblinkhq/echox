# Getting Started

There are several way to using EchoX.

## Installing from Package Manager

EchoX is typically installed via a package manager such as Yarn or NPM.

::: code-group

```sh [npm]
$ npm add -S echox
```

```sh [pnpm]
$ pnpm add -S echox
```

```sh [yarn]
$ yarn add -S echox
```

```sh [bun]
$ bun add -S echox
```

:::

EchoX can then imported as a namespace:

```js
import {html} from "echox";

const dom = html.div(["hello world"]);

document.body.append(dom);
```

## Imported as an ES module

In vanilla html, EchoX can be imported as an ES module, say from jsDelivr:

```html
<script type="module">
  import {html} from "https://cdn.jsdelivr.net/npm/echox/+esm";

  const dom = html.div(["hello world"]);

  document.body.append(dom);
</script>
```

## UMD Bundle

EchoX is also available as a UMD bundle for legacy browsers.

```html
<script src="https://cdn.jsdelivr.net/npm/echox"></script>
<script>
  const dom = ex.html.div(["hello world"]);

  document.body.append(dom);
</script>
```
