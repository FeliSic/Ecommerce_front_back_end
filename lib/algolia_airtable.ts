// airtable_algolia.ts
import Airtable from "airtable";
import { algoliasearch } from "algoliasearch";
require("dotenv").config();

const PAT_KEY_AIRTABLE = process.env.PAT_KEY_AIRTABLE;
const BASE_ID_AIRTABLE = process.env.BASE_ID_AIRTABLE;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

if (!PAT_KEY_AIRTABLE || !BASE_ID_AIRTABLE || !ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
  throw new Error("Faltan variables de entorno: verificá tu archivo .env");
}

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: PAT_KEY_AIRTABLE,
});

const base = Airtable.base(BASE_ID_AIRTABLE);

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

export { base, client }; // ✅ API nueva de Algolia v5 - exportar client