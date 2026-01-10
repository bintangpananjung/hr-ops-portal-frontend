import { generateZodClientFromOpenAPI } from "openapi-zod-client";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000";

async function fetchOpenAPISpec(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
  }
  return response.json();
}

async function generate() {
  try {
    console.log(`Fetching OpenAPI spec from ${API_URL}/api-json...`);

    const openApiDoc = await fetchOpenAPISpec(`${API_URL}/api-json`);

    await generateZodClientFromOpenAPI({
      openApiDoc,
      distPath: "./src/lib/generated/api-schema.ts",
      options: {
        withAlias: true,
        baseUrl: API_URL,
        shouldExportAllTypes: true,
      },
    });

    console.log(
      "API schema generated successfully at src/lib/generated/api-schema.ts"
    );
  } catch (error) {
    console.error("Failed to generate API schema:", error);
    process.exit(1);
  }
}

generate();
