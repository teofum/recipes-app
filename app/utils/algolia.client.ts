import algoliasearch from 'algoliasearch';

// Search-only API key, it's OK to ship this
const apiKey = 'b14894f130d995b0895ead04b965a70c';

/**
 * Algolia client initialized with the search-only API key,
 * safe to use in client code
 */
const algoliaSearch = algoliasearch('PUMBCMX00G', apiKey);

export default algoliaSearch;
