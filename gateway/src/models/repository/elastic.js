import { Client }  from '@elastic/elasticsearch';

// Create Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' }); 
async function searchFullText(text) {
    try {
        const { body } = await client.search({
            index: 'thesis',
            body: {
                query: {
                    bool: {
                        must: {
                            multi_match: {
                                query: text,
                                fields: ["title", "description", "requirement", "company"] // Specify the fields you want to search in
                            }
                        },
                        // filter: filters
                    }
                }
            }
        });

        console.log(body)
        return body.hits.hits.map(hit => hit._source);
    } catch (error) {
        console.error("Error occurred while searching documents:", error);
        throw error;
    }
}
export default searchFullText;