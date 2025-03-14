# Getting Started

There are several way to using EchoX.

## Installing from Package Manager

EchoX is typically installed via a package manager such as Yarn or NPM.

```bash
yarn add echox
```

```bash
npm install echox
```

EchoX can then imported as a namespace:

```js
import * as ex from "echox";
```

## Imported as an ES module

In vanilla HTML, EchoX can be imported as an ES module, say from jsDelivr:

```HTML
<script type="module">
  import * as ex from "https://cdn.jsdelivr.net/npm/echox/+esm";

  const dom = ex.HTML.div(["hello world"]);

  document.body.append(dom);
</script>
```

## UMD Bundle

EchoX is also available as a UMD bundle for legacy browsers.

```HTML
<script src="https://cdn.jsdelivr.net/npm/echox"></script>
<script>
  const dom = ex.HTML.div(["hello world"]);

  document.body.append(dom);
</script>
```
