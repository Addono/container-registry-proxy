import commander from 'commander'
import start, { StartArguments } from './commands/start'

const program = new commander.Command()

const collectValues: (value: string, previous: string[]) => string[] = (value, previous) =>
  previous.concat([value])

// Add the start command, which will act as our default entrypoint
program
  .command('start', { isDefault: true })
  .description('Starts the proxy server')
  .option(
    '--plugin <name>',
    'Adds a plugin by name, can be supplied multiple times. Can also be set as a comma separated list using the PLUGINS environment variable.',
    collectValues,
    process.env.PLUGINS?.split(',') ?? []
  )
  .option(
    '--customPlugin <path>',
    'Adds a custom plugin by path Can also be set as a comma separated list using the CUSTOM_PLUGINS environment variable.',
    collectValues,
    process.env.CUSTOM_PLUGINS?.split(',') ?? []
  )
  .option(
    '--port <port>',
    'The port to launch the service on. Can also be set using the PORT environment variable',
    process.env.PORT ?? '8080'
  )
  .option(
    '--registry <hostname>',
    'The host to forward requests to. Can also be set using the REGISTRY environment variable.',
    process.env.REGISTRY ?? 'registry.hub.docker.com'
  )
  .option(
    '--http',
    'Fall back to using HTTP instead of HTTPS. Can also be set by setting the HTTP environment variable to "true".',
    process.env?.HTTP?.toLowerCase() === 'true' ?? false
  )
  .action((args: StartArguments) => start(args))

program.parse(process.argv)
