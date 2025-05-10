import swaggerAutogen from 'swagger-autogen';

const outputFile = './public/swagger.json';

const endpointsFiles = [
  './*.ts',
  './routes/*.ts',
  './controllers/*.ts',
  './models/*.ts',
];

const doc = {
  info: {
    version: '', // by default: '1.0.0'
    title: '', // by default: 'REST API'
    description: '', // by default: ''
  },
  host: 'localhost:5000', // by default: 'localhost:3000'
  basePath: '', // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: '', // Tag name
      description: '', // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object
};

// Run the script
swaggerAutogen(outputFile, endpointsFiles, doc);

// https://swagger-autogen.github.io/docs/getting-started/advanced-usage
