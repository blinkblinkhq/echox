import * as EchoX from "echox";
import {test, expect, vi} from "vitest";
import {withContainer} from "./container.js";
import {sleep} from "./sleep.js";

const {html} = EchoX;

test("component should store template in tag.", () => {
  const div = html.div()("hello world");
  const Div = EchoX.component(div);
  const app = Div();
  expect(app.tag[1]).toBe(div);
});

test("component should construct nested structure.", () => {
  const Div = EchoX.component(html.div());
  const App = EchoX.component(Div()(html.h1()("Hello, World!"), Div()(html.p()("This is a test."))));
  const app = App();
  expect(app.tag[1].children[1].children[0].children[0]).toBe("This is a test.");
});

test("component should use state for attribute.", async () => {
  await withContainer((el) => {
    const App = EchoX.component(
      EchoX.reactive().state("style", "color: red").state("className", "test"),
      html.p({class: "test", style: (d) => d.style})("Hello World!"),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<p class="test" style="color: red;">Hello World!</p>`);
  });
});

test("component should use state for text nodes.", async () => {
  await withContainer((el) => {
    const App = EchoX.component(
      EchoX.reactive().state("test", "hello world"),
      html.p()((d) => d.test),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<p>hello world</p>`);
  });
});

test("component should use state for child component props.", async () => {
  await withContainer((el) => {
    const Hello = EchoX.component(EchoX.reactive().prop("style"), html.p({style: (d) => d.style})("Hello World!"));
    const App = EchoX.component(EchoX.reactive().state("style", "color: blue"), Hello({style: (d) => d.style}));
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<p style="color: blue;">Hello World!</p>`);
  });
});

test("component should pass props.", async () => {
  await withContainer((el) => {
    const Hello = EchoX.component(
      EchoX.reactive().prop("style", "color: red"),
      html.p({style: (d) => d.style})("Hello World!"),
    );
    const App = EchoX.component(html.div()(Hello({style: "color: blue"}), Hello()));
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(
      `<div><p style="color: blue;">Hello World!</p><p style="color: red;">Hello World!</p></div>`,
    );
  });
});

test("component should only use defined props.", async () => {
  await withContainer((el) => {
    const Hello = EchoX.component(html.p({style: (d) => d.style})("Hello World!"));
    const App = EchoX.component(html.div()(Hello({style: "color: blue"})));
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<div><p style="">Hello World!</p></div>`);
  });
});

test("component should bind state to attribute.", async () => {
  await withContainer(async (el) => {
    const style = vi.fn((d) => `background:${d.color}`);
    const color = vi.fn(() => "red");
    const App = EchoX.component(
      EchoX.reactive().state("color", color),
      EchoX.Fragment()(
        html.input({
          oninput: (d) => (e) => (d.color = e.target.value),
          value: (d) => d.color,
        }),
        html.p({style})("Hello World!"),
      ),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<input><p style="background: red;">Hello World!</p>`);
    expect(style.mock.calls.length).toBe(1);
    expect(color.mock.calls.length).toBe(1);

    const input = el.querySelector("input");
    input.value = "blue";
    input.dispatchEvent(new Event("input"));
    expect(style.mock.calls.length).toBe(1);

    await sleep();
    expect(style.mock.calls.length).toBe(2);
    expect(color.mock.calls.length).toBe(1);
    expect(el.innerHTML).toBe(`<input><p style="background: blue;">Hello World!</p>`);
  });
});

test("component should not computed unbind state.", async () => {
  await withContainer(async (el) => {
    const color = vi.fn(() => "red");
    const App = EchoX.component(EchoX.reactive().state("color", color), html.h1()("hello world"));
    EchoX.mount(el, App());
    expect(color.mock.calls.length).toBe(0);

    await sleep();
    expect(color.mock.calls.length).toBe(0);
  });
});

test("component should updated event handlers.", async () => {
  await withContainer(async (el) => {
    const count = vi.fn(() => 0);
    const increment = vi.fn(() => true);
    const App = EchoX.component(
      EchoX.reactive().state("count", count).state("increment", increment),
      EchoX.Fragment()(
        html.button({
          id: "button1",
          onclick: (d) => () => (d.increment = !d.increment),
        })("switch"),
        html.button({
          id: "button2",
          class: (d) => d.count,
          onclick: (d) => (d.increment ? () => d.count++ : () => d.count--),
        })("count"),
      ),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<button id="button1">switch</button><button id="button2" class="0">count</button>`);

    const button = el.querySelector("#button2");
    button.click();
    await sleep();

    expect(el.innerHTML).toBe(`<button id="button1">switch</button><button id="button2" class="1">count</button>`);

    const switchButton = el.querySelector("#button1");
    switchButton.click();
    await sleep();
    button.click();
    await sleep();

    expect(el.innerHTML).toBe(`<button id="button1">switch</button><button id="button2" class="0">count</button>`);
  });
});

test("component should only compute state once for multiple binds.", async () => {
  await withContainer(async (el) => {
    const className = vi.fn(() => "test");
    const App = EchoX.component(
      EchoX.reactive().state("class", className),
      EchoX.Fragment()(html.h1({class: (d) => d.class})("hello"), html.h1({class: (d) => d.class})("world")),
    );
    EchoX.mount(el, App());
    expect(className.mock.calls.length).toBe(1);

    await sleep();
    expect(className.mock.calls.length).toBe(1);
  });
});

test("component should compute derived state.", async () => {
  await withContainer(async (el) => {
    const message = vi.fn(() => "test");
    const reversed = vi.fn((d) => d.message.split("").reverse().join(""));
    const App = EchoX.component(
      EchoX.reactive().state("message", message).state("reversed", reversed),
      EchoX.Fragment()(html.h1({class: (d) => d.message})("hello"), html.h1({class: (d) => d.reversed})("world")),
    );
    EchoX.mount(el, App());
    expect(message.mock.calls.length).toBe(1);
    expect(reversed.mock.calls.length).toBe(1);
    expect(el.innerHTML).toBe(`<h1 class="test">hello</h1><h1 class="tset">world</h1>`);
  });
});

test("component should not compute derived state when not used.", async () => {
  await withContainer(async (el) => {
    const message = vi.fn(() => "test");
    const reversed = vi.fn((d) => d.message.split("").reverse().join(""));
    const App = EchoX.component(
      EchoX.reactive().state("message", message).state("reversed", reversed),
      html.h1({class: (d) => d.message})("hello"),
    );
    EchoX.mount(el, App());
    expect(message.mock.calls.length).toBe(1);
    expect(reversed.mock.calls.length).toBe(0);
  });
});

test("component should update derived state.", async () => {
  await withContainer(async (el) => {
    const message = vi.fn(() => "test");
    const reversed = vi.fn((d) => d.message.split("").reverse().join(""));
    const App = EchoX.component(
      EchoX.reactive().state("message", message).state("reversed", reversed),
      EchoX.Fragment()(
        html.input({
          oninput: (d) => (e) => (d.message = e.target.value),
          value: (d) => d.message,
        }),
        html.h1({class: (d) => d.reversed})("hello"),
      ),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<input><h1 class="tset">hello</h1>`);
    expect(message.mock.calls.length).toBe(1);
    expect(reversed.mock.calls.length).toBe(1);

    const input = el.querySelector("input");
    input.value = "world";
    input.dispatchEvent(new Event("input"));
    expect(message.mock.calls.length).toBe(1);
    expect(reversed.mock.calls.length).toBe(1);

    await sleep();
    expect(message.mock.calls.length).toBe(1);
    expect(reversed.mock.calls.length).toBe(2);
    expect(el.innerHTML).toBe(`<input><h1 class="dlrow">hello</h1>`);
  });
});

test("component should compute derived state with multiple dependencies in a batch.", async () => {
  await withContainer(async (el) => {
    const count = vi.fn(() => 0);
    const message = vi.fn(() => "test");
    const messageCount = vi.fn((d) => `${d.message} ${d.count}`);
    const App = EchoX.component(
      EchoX.reactive().state("count", count).state("message", message).state("messageCount", messageCount),
      EchoX.Fragment()(
        html.input({
          oninput: (d) => (e) => (d.message = e.target.value),
          value: (d) => d.message,
        }),
        html.button({onclick: (d) => () => (d.count += 1)})("Increment"),
        html.h1({class: (d) => d.messageCount})("hello"),
      ),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<input><button>Increment</button><h1 class="test 0">hello</h1>`);

    const input = el.querySelector("input");
    input.value = "world";
    input.dispatchEvent(new Event("input"));
    const button = el.querySelector("button");
    button.click();
    expect(messageCount.mock.calls.length).toBe(1);

    await sleep();
    expect(el.innerHTML).toBe(`<input><button>Increment</button><h1 class="world 1">hello</h1>`);
    expect(messageCount.mock.calls.length).toBe(2);
  });
});

test("component should track deps every update.", async () => {
  await withContainer(async (el) => {
    const count = vi.fn(() => 0);
    const message = vi.fn(() => "test");
    const App = EchoX.component(
      EchoX.reactive().state("count", count).state("message", message),
      EchoX.Fragment()(
        html.input({
          oninput: (d) => (e) => (d.message = e.target.value),
          value: (d) => d.message,
        }),
        html.button({onclick: (d) => () => (d.count += 1)})("Increment"),
        html.h1({class: (d) => (d.count > 0 ? d.message : "")})("hello"),
      ),
    );

    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<input><button>Increment</button><h1 class="">hello</h1>`);

    const button = el.querySelector("button");
    button.click();
    await sleep();
    expect(el.innerHTML).toBe(`<input><button>Increment</button><h1 class="test">hello</h1>`);

    const input = el.querySelector("input");
    input.value = "world";
    input.dispatchEvent(new Event("input"));
    await sleep();
    expect(el.innerHTML).toBe(`<input><button>Increment</button><h1 class="world">hello</h1>`);
  });
});

test("component should avoid self-referencing.", async () => {
  await withContainer(async (el) => {
    const count = vi.fn(() => 0);
    const App = EchoX.component(
      EchoX.reactive().state("count", count),
      html.button({
        onclick: (d) => () => d.count++,
        id: (d) => ++d.count,
      })("Increment"),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<button id="1">Increment</button>`);

    const button = el.querySelector("button");
    button.click();
    await sleep();
    expect(el.innerHTML).toBe(`<button id="1">Increment</button>`);
  });
});

test("component should update props.", async () => {
  await withContainer(async (el) => {
    const ColorLabel = EchoX.component(
      EchoX.reactive().prop("color"),
      html.span({style: (d) => `color: ${d.color}`})("label"),
    );

    const App = EchoX.component(
      EchoX.reactive().state("color", () => "red"),
      EchoX.Fragment()(
        html.input({
          oninput: (d) => (e) => (d.color = e.target.value),
          value: (d) => d.color,
        }),
        ColorLabel({color: (d) => d.color}),
      ),
    );

    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<input><span style="color: red;">label</span>`);

    const input = el.querySelector("input");
    input.value = "blue";
    input.dispatchEvent(new Event("input"));
    await sleep();
    expect(el.innerHTML).toBe(`<input><span style="color: blue;">label</span>`);
  });
});

test("component should update text nodes.", async () => {
  const text = vi.fn((d) => (d.hello ? "hello" : "world"));
  await withContainer(async (el) => {
    const App = EchoX.component(
      EchoX.reactive().state("hello", () => true),
      EchoX.Fragment()(html.button({onclick: (d) => () => (d.hello = !d.hello)})("switch"), html.p()(text)),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<button>switch</button><p>hello</p>`);

    const button = el.querySelector("button");
    button.click();
    await sleep();
    expect(el.innerHTML).toBe(`<button>switch</button><p>world</p>`);
    expect(text.mock.calls.length).toBe(2);
  });
});

test("component should track object state.", async () => {
  await withContainer(async (el) => {
    const obj = vi.fn(() => ({name: "test"}));
    const App = EchoX.component(
      EchoX.reactive().state("obj", obj),
      EchoX.Fragment()(
        html.button({onclick: (d) => () => (d.obj.name = "world")})("switch"),
        html.p()((d) => d.obj.name),
      ),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<button>switch</button><p>test</p>`);

    const button = el.querySelector("button");
    button.click();
    await sleep();
    expect(el.innerHTML).toBe(`<button>switch</button><p>world</p>`);
  });
});

test("component should not track function in object state.", async () => {
  await withContainer(async (el) => {
    const obj = vi.fn(() => ({name: "test", fn: (d) => d}));
    const App = EchoX.component(
      EchoX.reactive().state("obj", obj),
      html.p()((d) => d.obj.fn("hello")),
    );
    EchoX.mount(el, App());
    expect(el.innerHTML).toBe(`<p>hello</p>`);
  });
});
