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

### `standardize`

My sketches are very varied. I want them to conform to a consistent style with standard dimensions, colors, and themes.

### `utilities`

Major topic branch. Design a CLI to manage the sketches with CRUD operations.
