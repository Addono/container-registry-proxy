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
- [Usage](#usage)
- [Deployment](#deployment)
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

### Running Locally

To start the development environment using either of the following commands:

```bash
# Without file watching
yarn start

# With file watching
yarn dev
```

### Running in Kubernetes using DevSpace

Build the application, the `--watch` flag is optional and enables automatic hotreloading:

```bash
yarn build --watch
```

Then to configure and launch [DevSpace](https://devspace.sh/) run:

```bash
# Configure DevSpace to the desired namespace
devspace use namespace container-registry-proxy

# Deploy a development version onto K8s
devspace dev
```

## 🎈 Usage <a name="usage"></a>

Once you have a proxy running, you can use it like this:

```bash
# For https://hub.docker.com/r/addono/container-registry-proxy
docker pull localhost:8080/addono/container-registry-proxy

# For https://hub.docker.com/_/nginx
docker pull localhost:8080/library/nginx
```

> Note: If your Docker daemon is running in a VM, which would be the case if you're using Docker Toolbox on Mac, then pulling directly from localhost will not work. One workaround is using ngrok to have a publicly available domain name to connect to:
>
> ```bash
> # Note the ngrok domain assigned to you
> ngrok http 8080
>
> # Make sure to replace the ngrok domain name
> docker pull 5d354ae8.ngrok.io/library/nginx
> ```

## 🔧 Running the Tests <a name = "tests"></a>

After setting up the development environment, tests can be invoked using:

```bash
yarn test
```

## 🚀 Deployment <a name = "deployment"></a>

We automatically build and deploy the latest version and all [releases](https://github.com/Addono/container-registry-proxy/releases) to:

- [NPM](https://www.npmjs.com/package/container-registry-proxy)
- [Docker Hub](https://hub.docker.com/r/addono/container-registry-proxy)

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
