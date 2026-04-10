import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'pollclass';

export let client;
export let db;
export let users;
export let polls;
export let votes;

export async function connectDatabase() {
  if (db) {
    return;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    users = db.collection('users');
    polls = db.collection('polls');
    votes = db.collection('votes');

    await Promise.all([
      users.createIndex({ email: 1 }, { unique: true }).catch(() => {}),
      votes.createIndex({ pollId: 1, voterEmail: 1 }, { unique: true }).catch(() => {}),
      polls.createIndex({ code: 1 }, { unique: true }).catch(() => {}),
    ]);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
