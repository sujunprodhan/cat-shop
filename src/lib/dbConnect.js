const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

export const Collection = {
  PRODUCTS: 'products',
  USERS: 'users',
  CART: 'cart',
};
const { MongoClient, ServerApiVersion } = require('mongodb');

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//get a collection
export const dbConnect = (cname) => {
  return client.db(dbName).collection(cname);
};
