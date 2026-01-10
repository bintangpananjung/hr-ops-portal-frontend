export class ApiClient {
  baseUrl: string;
  constructor() {
    this.baseUrl = process.env.VITE_API_URL || "http://localhost:8000";
  }
}
