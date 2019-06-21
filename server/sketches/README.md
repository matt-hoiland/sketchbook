# `sketchbook/server/sketches`

Sketches written in TypeScript, compiled to JavaScript, served dynamically to the apps.

These sketches are designed to be easily attached and detached from the root object by namespace encapsulation. The namespace exposes certain standard objects:

```TypeScript
export namespace Sketch {
  export function initSketch(p: p5): void;

  export controls: {
    setup: Control[];
    draw: Control[];
  };

  export class Control {
    name: string;
    html_type: string;
    js_type: string;
    description: string;
    endpoint: any;
  }
}
```

## The `initSketch` Function

p5 requires an initializer function which overrides certain methods on the p5 instance. Every sketch provides an `initSketch` function for this purpose.

## The `controls` Object

Often I've wanted to twiddle the dials on a sketch's initialization or change something as it runs. The client app(s) can provide html inputs for each control parameter specified. Some parameters need to be set at the start of the sketch, but many can be controlled while the sketch is running. A brief explanation of each field follows:

- `name`: the name to be rendered for the control in the app
- `html_type`: the type of input tag to be used (`<button>`, `<input>`, `<slider>`, etc)
- `js_type`: the type of the `endpoint` variable in JavaScript (`number`, `string`, etc)
- `endpoint`: the live reference to the variable being changed
