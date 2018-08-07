const config = require('./mock_dl/server_config.json') as { bot: { id: string, name: string }, port: string, widthTests: { [id: string]: number } };

config.port = process.env.PORT || config.port;

export default config
