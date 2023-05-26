const { MongoClient } = require("mongodb");

const EMAILS = ["your_user_email"]; //currently supports one
const DBNAME = "preprod-manaslu"; // e.g. preprod-manaslu
const USER_COLLECTION_NAME = "users";
const FOUNDRIES_COLLECTION_NAME = "foundries";

async function main() {
  console.log("------------------- Start --------------------------------");

  const uri = "mongodb+srv://"; //mongo connection string

  const client = new MongoClient(uri);

  try {
    await client.connect();
    await getIds(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("------------------- End --------------------------------");
  }
}

async function getIds(client) {
  const database = client.db(DBNAME);
  const usersCollection = database.collection(USER_COLLECTION_NAME);

  const user = await usersCollection.findOne({ email: EMAILS[0] });

  if (!user) {
    console.error("User not Found");
  } else {
    console.info("User AuthO => " + user.legacyData.auth0.id);
    const foundriesCollection = database.collection(FOUNDRIES_COLLECTION_NAME);

    console.info("Foundries AuthO => ");
    for (let foundry of user.foundries) {
      const extraFoundryDetail = await foundriesCollection.findOne({
        _id: foundry.id,
      });
      console.info(extraFoundryDetail.legacyData.auth0.id);
    }
  }
}

main().catch(console.error);
