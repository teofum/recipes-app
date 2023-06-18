import algoliasearch from 'algoliasearch';

const apiKey = process.env.ALGOLIA_ADMIN_KEY;
if (!apiKey) throw new Error('ALGOLIA_ADMIN_KEY envvar missing');

/**
 * Algolia client initialized with the search-only API key,
 * should only be used in server
 */
const algoliaAdmin = algoliasearch('PUMBCMX00G', apiKey);

export default algoliaAdmin;
