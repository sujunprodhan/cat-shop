import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export const Collection = {
  PRODUCTS: 'products',
  USERS: 'users',
  CART: 'cart',
  ORDERS: 'orders',
};

let client;

if (process.env.NODE_ENV === 'development') {

  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

// Get a collection
export const dbConnect = (cname) => {
  return client.db(dbName).collection(cname);
};

export { client };
