# Container Registry Proxy

[![License](https://img.shields.io/github/license/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/blob/master/LICENSE)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://img.shields.io/badge/project%20status-WIP-yellow?style=flat-square)](https://www.repostatus.org/#wip)
[![npm](https://img.shields.io/npm/dw/container-registry-proxy?style=flat-square)](https://www.npmjs.com/package/container-registry-proxy)
[![npm](https://img.shields.io/npm/v/container-registry-proxy?style=flat-square)](https://www.npmjs.com/package/container-registry-proxy)
[![GitHub stars](https://img.shields.io/github/stars/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/network)
[![GitHub issues](https://img.shields.io/github/issues/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/pulls)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Running the Tests](#tests)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributors](#contributors)

## 🧐 About <a name = "about"></a>

The Container Registry Proxy is a small proxy for communicating with a container registry. The end-goal of the project is to allow alternating traffic in-transit as to facilitate chaos engineering.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need to have [Yarn](https://yarnpkg.com/en/docs/install) installed to use this repository.

### Installing

First we need to install all dependencies, run:

```bash
yarn install
```

To start the development environment, run:

```bash
# Without file watching
yarn start

# With file watching
yarn dev
```

## 🔧 Running the Tests <a name = "tests"></a>

After setting up the development environment, tests can be invoked using:

```bash
yarn test
```

## 🎈 Usage <a name="usage"></a>

Execute:

```bash
yarn build
```

Which builds the app for production to the `dist` folder.

## 🚀 Deployment <a name = "deployment"></a>

We automatically build and deploy the latest version to NPM.

## ✨ Contributors <a name = "contributors"></a>

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://aknapen.nl"><img src="https://avatars1.githubusercontent.com/u/15435678?v=4" width="100px;" alt=""/><br /><sub><b>Adriaan Knapen</b></sub></a><br /><a href="https://github.com/Addono/container-registry-proxy/commits?author=Addono" title="Code">💻</a> <a href="https://github.com/Addono/container-registry-proxy/commits?author=Addono" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
