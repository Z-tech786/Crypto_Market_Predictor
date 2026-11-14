export async function connectToDatabase(mongoose, uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is required to start the API.');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
