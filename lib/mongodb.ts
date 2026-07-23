import mongoose from "mongoose";
const MONGODB_URI = process.env.DATABASE_URL as string;
if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI aniqlanmagan yoki .env faylida MONGODB_URI ni belgilang.",
  );
}
interface MongooseCashe {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}
declare global {
  var mongooseCashe: MongooseCashe | undefined;
}
const cashed: MongooseCashe = global.mongooseCashe ?? {
  conn: null,
  promise: null,
};
if (!global.mongooseCashe) {
  global.mongooseCashe = cashed;
}
export async function connectDB(): Promise<typeof mongoose> {
  if (cashed.conn) {
    return cashed.conn;
  }
  if (!cashed.promise) {
    cashed.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cashed.conn = await cashed.promise;
  return cashed.conn;
}