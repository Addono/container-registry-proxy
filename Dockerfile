ARG NODE_IMAGE=node:12

# Build the application
FROM ${NODE_IMAGE} AS builder

# Retrieve all dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

# Build the application from source
COPY src .
COPY tsconfig.json .

RUN yarn build

# Define the image actually running
FROM ${NODE_IMAGE}-alpine AS runner

WORKDIR /application/

# Retrieve the application distributable from the builder
COPY --from=builder dist/ dist/

EXPOSE 8080

# Run the application as a different user than root
# https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/non-root-user.md
USER node

ENTRYPOINT ["node", "dist/index"]
