/**
 * Microservices base URLs - parametrized via env
 */

const GATEWAY_PORT = process.env.GATEWAY_PORT || "8001";
const GATEWAY_HOST = process.env.GATEWAY_HOST || "localhost";
const MS_AUTH_PORT = process.env.MS_AUTH_PORT || "5001";

class SERVICE {
  public static readonly GATEWAY_HOST: string = GATEWAY_HOST;
  public static readonly GATEWAY_PORT: string = GATEWAY_PORT;
  public static readonly GATEWAY_URL: string = `http://${this.GATEWAY_HOST}:${this.GATEWAY_PORT}`;

  public static readonly MS_AUTH_PORT: string = MS_AUTH_PORT;
  public static readonly MS_AUTH_API_BASE_URL: string = `http://localhost:${this.MS_AUTH_PORT}`;
  public static readonly MS_AUTH_SUBDOMAIN: string = "auth";
}

export default SERVICE;
