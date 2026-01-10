import { generateZodClientFromOpenAPI } from "openapi-zod-client";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000";

async function generate() {
  try {
    console.log(`Fetching OpenAPI spec from ${API_URL}/api-json...`);

    const response = await fetch(`${API_URL}/api-json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
    }
    const openApiDoc = await response.json();

    await generateZodClientFromOpenAPI({
      openApiDoc: openApiDoc as any,
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
