import { Client } from "@elastic/elasticsearch";
const client = new Client({
  node: "http://localhost:9200",
  // auth: {
  //   username: "elastic",
  //   password: "R*wyXcr3+OawT5A-g40R", // Replace with the actual password generated during setup
  // },
});
export default async (indexName) => {
  try {
    const response = await client.indices.create({
      index: indexName,
      body: {
        settings: {
          number_of_shards: 1,
        },
        mappings: {
          properties: {
            title: { type: "text" },
            description: { type: "text" },
            requirement: { type: "text" },
            company: { type: "text" },
          },
        },
      },
    });
    console.log("Index created:", response);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
