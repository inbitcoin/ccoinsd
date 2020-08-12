# ccoinsd - Colored Coins API service

This service is used to access to the colored indexed database and retrieve all the colored asset informations.

## API documentation

API documentation is based on a `swagger.json` file, which follows
OpenAPI Specification 3.0.3, and is available at `/api-docs`.

## Minimum requirements

- 512MB RAM
- dual core CPU

## Configuration

Put a `config-local.js` file in the project root directory
(`/srv/app/config-local.js` in docker) to change the default configuration.
See the following example (containing default values):
```
module.exports = {
  env: 'production',
  testnet: false,
  cexplorer: {
    url: 'https://cexplorer.example.com',
  },
  logLevel: 'info',
  port: 8080,
}
```

## Build and run

### locally

To build the service, run:
```bash
npm install
```
To run the service:
```bash
npm start
```

### docker

In order to build a docker image of this project, run:
```bash
docker build -t <tag> -f docker/Dockerfile .
```
To run the docker image:
```bash
docker run --rm -p 8080:8080 -v $(pwd)/config-local.js:/srv/app/config-local.js <tag>
```

## License

This software is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for the full license text.
