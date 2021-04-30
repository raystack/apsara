# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.5](https://github.com/odpf/apsara/compare/v0.5.4...v0.5.5) (2021-04-30)


### Features

* **form:** export `FormMetaFields` type definition ([8376520](https://github.com/odpf/apsara/commit/8376520425320f1aa5b551ff3392f9093c496cc8))





## [0.5.1](https://github.com/odpf/apsara/compare/v0.5.0...v0.5.1) (2021-04-20)


### Features

* export switch component ([69871cc](https://github.com/odpf/apsara/commit/69871ccd42cc2c5900df0086406429f9f8cfec0b))
* **states:** hide icon if iconProps is not passed ([700c79e](https://github.com/odpf/apsara/commit/700c79ebbc6edc96edde5ecdc461ce25749c1e76))





# [0.5.0](https://github.com/odpf/apsara/compare/v0.4.1...v0.5.0) (2021-04-08)


### Features

* **button:** add iconProps to override button icon ([3d3a79f](https://github.com/odpf/apsara/commit/3d3a79f2fd3ba2c25386ad686c79513ccc1960c1))
* **icon:** make name props optional ([015ba09](https://github.com/odpf/apsara/commit/015ba0933c50a6536de61741ecaeefefe60dec64))
* **popover:** add custom content body and cancel btn ([92385e3](https://github.com/odpf/apsara/commit/92385e3e8c89e71b7f7787fb9df0995b5cbd5834))
* **states:** update icon props from string to react component ([b069d8f](https://github.com/odpf/apsara/commit/b069d8f42c0d71d90b77bebb568f0285196cda4a))
* **tabs:** extends props type definitions ([b788255](https://github.com/odpf/apsara/commit/b788255a9709e9af462da50bc0b06e24ff05eb1d))


* refactor(sidebar)!: rename icon to iconProps ([1b1ea60](https://github.com/odpf/apsara/commit/1b1ea60382051331ebccb081758c2f01205e0034))


### Bug Fixes

* **tabs:** add missing class name in lg tabs ([e5bb0b9](https://github.com/odpf/apsara/commit/e5bb0b92bd60919e942c3698390a59ba25be8385))
* **tabs:** override antd default margin ([25ca519](https://github.com/odpf/apsara/commit/25ca5196cba1ff0626c457203eb8b9885e9bcb80))


### BREAKING CHANGES

* old `icon` is renamed as `iconProps` and `iconComponent` as `icon`
* **states:** old `imageIcon` is renamed as `icon`, old `icon` name is `iconProps.name`





## [0.4.1](https://github.com/odpf/apsara/compare/v0.4.0...v0.4.1) (2021-03-30)


### Features

* **formbuilder:** add type definitions for mode and tokenSeparators props ([0723ec7](https://github.com/odpf/apsara/commit/0723ec729501a2c8003c77155ac4774941d1fa40))
* **icons:** add type definitions to index file ([902cf7f](https://github.com/odpf/apsara/commit/902cf7fd084f30e0f922c7b06d46fc173a9f2c1a))





# [0.4.0](https://github.com/odpf/apsara/compare/v0.3.0...v0.4.0) (2021-03-30)


### Features

* **icon:** create seperate icon component ([e8c4423](https://github.com/odpf/apsara/commit/e8c442336e809fb464e1f298307565a1c9b1223c))





# [0.3.0](https://github.com/odpf/apsara/compare/v0.2.1...v0.3.0) (2021-03-30)


### Features

* **icon:** add commit icon ([d0362d7](https://github.com/odpf/apsara/commit/d0362d7a0306175f609160442479471b9b0da6f9))
* **icon:** add save and history icon ([2854c5d](https://github.com/odpf/apsara/commit/2854c5d826ca032182012b40aec08ad96b239ceb))
* **listing:** make props optional in infinite listing ([6b48649](https://github.com/odpf/apsara/commit/6b48649db7508fdb44cd08b181917793e192e93b))





## [0.2.1](https://github.com/odpf/apsara/compare/v0.2.0...v0.2.1) (2021-03-26)


### Bug Fixes

* **FormBuilderItems:** make return type a react component ([ec8e40d](https://github.com/odpf/apsara/commit/ec8e40d71377e1c5291ec00d9f571dbca051f4d2))


### Features

* **formbuilder:** add type definition to option props ([52cf452](https://github.com/odpf/apsara/commit/52cf452066d15b2aa2d2838ac5b536604c8c7eba))
* **formbuilder:** add types to config object ([d07a21c](https://github.com/odpf/apsara/commit/d07a21ccdb57fc8e7db0b64b379f505424e1812d))
* **states:** add loading and success states ([583fa83](https://github.com/odpf/apsara/commit/583fa836951b9a72f8b2699f70f99b39b07a0801))





# [0.2.0](https://github.com/odpf/apsara/compare/v0.1.3...v0.2.0) (2021-03-25)


### Features

* export Radio, Checkbox, Image, Select and Tile components ([7f69f13](https://github.com/odpf/apsara/commit/7f69f130c2c43340549a1137a5987b7d8058606d))
* **listing:** add default value to the props and make them optional ([e438384](https://github.com/odpf/apsara/commit/e4383845a15e4bb91ad0f04ae46e904d055c65df))
