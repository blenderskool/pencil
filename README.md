<p align="center">
  <img src="https://penciljs.netlify.com/img/logo.svg" alt="Pencil">
</p>

<p align="center">
  Pencil is a powerful <b>static documentation website generator</b> that works on <b>Markdown</b>.
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/@penciljs/core">
    <img src="https://img.shields.io/npm/v/@penciljs/core.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@penciljs/core">
    <img src="https://img.shields.io/npm/l/@penciljs/core.svg" alt="License">
  </a>
</p>

## What can it do?
Pencil allows you to write content in [Markdown](https://en.wikipedia.org/wiki/Markdown), which has a very **powerful** and **easy** to learn markup syntax. You can quickly start creating your website without much code.

Pencil will automatically create the required files for your website, which are **ready to be deployed** to services like Netlify, GitHub Pages.


## Features
**Static site generation**
- Minified files
- SEO friendly
- Integrate external files

**Built-in markdown plugins**
- Table of contents
- Anchored Headings
- Code highlighting
- Callouts
- YouTube player embed
- Emoji

**Customization**
- Control theme color
- Dark theme :dark_sunglasses:
- Custom plugins support

## Quick start
Pencil site can be created quickly using the CLI tool. Make sure you have recent LTS version of [Node.js](https://nodejs.org/) installed. Follow the commands below:
```bash
npm install -g @penciljs/core
pencil init
# follow steps shown in CLI
```
> Installing dependencies via `npm install` is not necessary if CLI is globally installed.


## Development
Following commands must be followed to setup Pencil development environment.

```bash
git clone https://github.com/blenderskool/pencil
cd pencil
npm install
npm run dev
```
By default, the dev server opens at port `3000` with the playground.
Playground is where you can test the code and make live changes to it.

### Directory structure
Pencil follows the following directory structure,
- `src` - Contains the source code.
  - `core` - Core modules that are used.
    - `functions` - Contains the code for the builder.
    - `templates` - Template files that define the structure, design and basic functionality of documentation website.
    - `utils` - Helper functions used extensively in functions.
- `playground` - A sample documentation website setup to test Pencil features during development.
- `bin` - Contains the scripts for the CLI.

## Contributing
Make sure you create a fork of this repository before you start contributing.
```bash
git clone <your-forked-repo>
cd <your-forked-repo>
npm install
npm run dev

git checkout -b some-fix
# make changes to the code

git commit -m "Your commit message"
git push origin some-fix
```

> Use the playground to test your code.
> **Do not commit changes made in the `playground`.**

Once you are done with the changes, you can open a pull request to `dev` branch.

## License
Pencil is [MIT Licensed](https://github.com/blenderskool/pencil/blob/master/LICENSE)