# Sketchbook

## Design Ideas

- Angular
  - Sketch Component
  - Sketch Fetching Service
- p5js
- Dynamically loading JavaScript
  - Bind initializer function to global scope
  - Unbind upon object destruction
- Encapsulated sketch files
  - p5 has a method `remove()` which unbinds everything.

## Active Branches

### `master`

Main code branch. All other branches merge from it when updating. No topic branch should merge with any other branch. When a topic branch is ready to share its code, it should pull request into master.

### `angular`

Major topic branch. All work to build an app to host the sketches lives here.

#### 2019-06-10

- [x] Prove concept: dynamic creation and deletion of sketches

#### 2019-06-11

- [x] Refactor workspace to enable multiple projects
- [x] Generate conversion project

### `standardize`

My sketches are very varied. I want them to conform to a consistent style with standard dimensions, colors, and themes.

#### 2019-06-10 and 2019-06-11

- [x] Refactor all sketches to instance mode
- [x] Resize all canvases to the default 512x512.
- [x] Replace all `var`s with `let`s (except when binding to the global object is preferred)
- [x] Terminate all expressions with semicolons

### `utilities`

Major topic branch. Design a CLI to manage the sketches with CRUD operations.
