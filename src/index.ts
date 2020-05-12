import commander from 'commander'
import start, { StartArguments } from './commands/start'

const program = new commander.Command()

const collectValues: (value: string, previous: string[]) => string[] = (value, previous) =>
  previous.concat([value])

// Add the start command, which will act as our default entrypoint
program
  .command('start', { isDefault: true })
  .description('Starts the proxy server')
  .option('--plugin <name>', 'Adds a plugin by name, can be supplied multiple times', collectValues, [])
  .option('--port <port>', 'The port to launch the service on', '8080')
  .option('--registry <hostname>', 'The host to forward requests to', 'registry.hub.docker.com')
  .option('--http', 'Fall back to using HTTP instead of HTTPS')
  .action((args: StartArguments) => start(args))

program.parse(process.argv)
