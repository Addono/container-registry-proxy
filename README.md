# Container Registry Proxy

[![License](https://img.shields.io/github/license/Addono/container-registry-proxy?style=flat-square)](https://github.com/Addono/container-registry-proxy/blob/master/LICENSE)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://img.shields.io/badge/project%20status-Active-greengrass?style=flat-square)](https://www.repostatus.org/#active)
[![npm](https://img.shields.io/npm/dt/container-registry-proxy?style=flat-square)](https://www.npmjs.com/package/container-registry-proxy)
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
- [Deployment](#deployment)
- [Usage](#usage)
- [Running the Tests](#tests)
- [Contributors](#contributors)

## 🧐 About <a name = "about"></a>

The Container Registry Proxy is a small proxy for communicating with a container registry. This proxy supports plugins, these plugins implement a simple typed interface, which allows them to let the proxy modify requests in-transit.

![Diagram showing how the proxy hands-off requests to plugins](https://raw.githubusercontent.com/Addono/container-registry-proxy/master/docs/images/crp-usage-diagram-chainable-plugins.svg)

Here's a small demo on how to use the proxy together with the build in Semantic Chaos-plugin. This plugin intercepts requests to resolve a tag to a specific container, and replaces this tag with a random tag which is within scope of the semantic versioning. In this case, the user requested tag `4`, the proxy then retrieves all tags which match `4.x.x` and returns one at-random to the user.

[![Demo](https://i.imgur.com/SXidWbc.gif)](https://i.imgur.com/h9xG5ne.mp4)

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

## 🚀 Deployment <a name = "deployment"></a>

We automatically build and deploy all [releases](https://github.com/Addono/container-registry-proxy/releases) to:

- [NPM](https://www.npmjs.com/package/container-registry-proxy)
- [Docker Hub](https://hub.docker.com/r/addono/container-registry-proxy)

### NPM

Install the application locally:

```bash
# Install globally in NPM
npm install -g container-registry-proxy

# Install globally in Yarn
yarn global add container-registry-proxy
```

Start the proxy:

```bash
# Full command
container-registry-proxy --help

# A short name is also available
crp --help
```

### Docker

```bash
docker run --rm -it -p 8080:8080 --name crp addono/container-registry-proxy --help
```

## 🎈 Usage <a name="usage"></a>

The default configuration of the proxy can be overwritten during startup by adding flags:

```bash
$ container-registry-proxy start --help
Usage: container-registry-proxy start [options]

Starts the proxy server

Options:
  --plugin <name>        Adds a plugin by name, can be supplied multiple times (default: [])
  --customPlugin <path>  Adds a custom plugin by path (default: [])
  --port <port>          The port to launch the service on (default: "8080")
  --registry <hostname>  The host to forward requests to (default: "registry.hub.docker.com")
  --http                 Fall back to using HTTP instead of HTTPS
  -h, --help             display help for command
```

Once you have a proxy running, you can use it like this:

```bash
# For https://hub.docker.com/r/addono/container-registry-proxy
docker pull localhost:8080/addono/container-registry-proxy

# For https://hub.docker.com/_/nginx
docker pull localhost:8080/library/nginx
```

> Note: If your Docker daemon is running in a VM, which would be the case if you're using Docker Toolbox on Mac, then pulling directly from localhost will not work.
>
> One workaround is using ngrok to have a publicly available domain name to connect to. As an added benefit, this also gives HTTPS support out of the box:
>
> ```bash
> # Note the ngrok domain assigned to you
> ngrok http 8080
>
> # Make sure to replace the ngrok domain name
> docker pull 5d354ae8.ngrok.io/library/nginx
> ```

### Custom Plugins

Custom plugins are simple JavaScript modules implementing the [`Plugin`](./src/plugins.ts) interface, which are loaded in at runtime. An example of a custom plugin can be found [here](https://github.com/Addono/container-registry-proxy-custom-plugin-example). Assuming we have the `container-regsitry-proxy` installed locally and a plugin in `./dist/plugin.js`, then we can load this plugin using:

```bash
container-registry-proxy --customPlugin ./dist/plugin.js
```

### Creating Custom Plugins

To create your own custom plugin, it is recommended to write it in TypeScript and compile it to JavaScript. It's easiest to fork or copy the [example plugin](https://github.com/Addono/container-registry-proxy-custom-plugin-example) and follow the instructions there, as it already incorporates various best-practices to ease development.

Alternatively, a minimal approach on creating a plugin would follow the following steps:

```bash
yarn global add container-registry-proxy typescript
```

Create a file `plugin.ts` with the following content:

```typescript
import { Request, Plugin } from 'container-registry-proxy/dist/plugins'

const plugin: Plugin = {
  name: 'Logger',
  description: 'Merely logs all requests',
  requestPipe: async (request: Request) => {
    console.log('LOGGER:', request)
    return request
  },
}

export default plugin
```

Now compile it into JavaScript:

```bash
tsc plugin.ts
```

Now, the plugin can be used by running:

```bash
container-registry-proxy --customPlugin plugin.js
```

## 🔧 Running the Tests <a name = "tests"></a>

After setting up the development environment, tests can be invoked using:

```bash
yarn test
```

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
