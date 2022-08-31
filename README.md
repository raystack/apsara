# Apsara

![build workflow](https://github.com/odpf/apsara/actions/workflows/storybook.yml/badge.svg)
[![License](https://img.apsaras.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
<a href="https://odpf.github.io/apsara/" target="_blank"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg"></a>


Apsara 🧚‍♀️ is a React UI framework written in TypeScript on top of [Ant Design](https://ant.design/) to power the projects for Open Data Platform. Open Data Platform has a large number of enterprise-level products. With complex scenarios, designers and developers often need to respond fast due to frequent changes in product demands and concurrent R & D workflow. Many similar contents exist in the process. Through abstraction, we could obtain some stable and highly reusable components and pages on top of Ant Design.
  
<p align="center"><img  width=80% src="./.storybook/images/banner.png" /></p>

## Key Features
Discover why users choose Apsara as the design system for their projects

* **Flexible** Apsara components are built on top of a Ant UI Primitive for endless composability.
* **Enterprise-grade** Apsara features a UI design language for enterprise-grade web applications.
* **Abstraction** Apsara provides abstracted components for bulding complex data interfaces.

## Usage

Explore the [Storybook](https://odpf.github.io/apsara/) to learn about all the Apsara components.

```sh
$ yarn add @odpf/apsara
# or
$ npm install --save @odpf/apsara
```

Use Apsara components inside your react project

```js
import { Button } from "@odpf/apsara";

<Button size="small" type="barebone" iconName="save">
  I am using 🧚‍♀️ Apsara!
</Button>
```

## Running locally

```sh
# Download and install all required packages and set up the yarn workspace.
$ yarn install

# Launch storybook
$ yarn storybook
```

Open http://localhost:6006/ in your favorite browser.

## Running Tests

```sh
$ yarn test
```

## Contribute

Development of Apsara happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and
improvements. Read below to learn how you can take part in improving Apsara.

Read our contributing guide to learn about our development process, how to propose
bugfixes and improvements, and how to build and test your changes to Apsara.

To help you get your feet wet and get you familiar with our contribution process, we have a list of
[good first issues](https://github.com/odpf/apsara/labels/good%20first%20issue) that contain bugs which have a relatively
limited scope. This is a great place to get started.

This project exists thanks to all the [contributors](https://github.com/odpf/apsara/graphs/contributors).

## License

Apsara is [Apache 2.0](LICENSE) licensed.