ARG NODE_IMAGE=node:12

# Temporary variable as a workaround to use DevSpace code reloading
ARG USER=node

# Build the application
FROM ${NODE_IMAGE} AS builder

# Retrieve all dependencies
COPY package.json .
COPY yarn.lock .

# Retrieve the Snyk manifest
COPY .snyk .

RUN yarn install --frozen-lockfile

# Build the application from source
COPY src .
COPY tsconfig.json .

RUN yarn build

# Remove all non-production dependencies
RUN yarn install --production=true --frozen-lockfile

# Define the image actually running
FROM ${NODE_IMAGE}-alpine AS runner

ENV NODE_ENV=production

WORKDIR /application/

# Retrieve the application distributable from the builder
COPY --from=builder dist/ dist/

# Install all prod dependencies
COPY --from=builder node_modules/ node_modules/

EXPOSE 8080

# Run the application as a different user than root
# https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/non-root-user.md
USER $USER

ENTRYPOINT ["node", "dist/index"]
