import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSessionToken, getAdminAccessKey, readSessionFromRequest, readSessionToken } from "./rbxis-auth";

describe("RBXIS session auth", () => {
  beforeEach(() => {
    vi.stubEnv("RBXIS_SESSION_SECRET", "unit-test-session-secret");
    vi.stubEnv("RBXIS_ADMIN_KEY", "configured-test-admin");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("round-trips a user session with its claims", () => {
    const token = createSessionToken({ role: "user", userId: 42, licenseId: 7, username: "player_pro" });
    const session = readSessionToken(token);

    expect(session?.role).toBe("user");
    expect(session?.userId).toBe(42);
    expect(session?.licenseId).toBe(7);
    expect(session?.username).toBe("player_pro");
    expect(session?.expiresAt).toBeGreaterThan(Date.now());
  });

  it("rejects tampered and malformed tokens", () => {
    const token = createSessionToken({ role: "admin", username: "Ferraodev" });
    const [payload] = token.split(".");

    expect(readSessionToken(`${payload}.tampered`)).toBeNull();
    expect(readSessionToken("not-a-session")).toBeNull();
    expect(readSessionToken(undefined)).toBeNull();
  });

  it("uses the privately configured admin access key", () => {
    expect(getAdminAccessKey()).toBe("configured-test-admin");
  });

  it("fails closed when the admin key and session secret are unset", () => {
    const token = createSessionToken({ role: "admin", username: "test" });
    vi.stubEnv("RBXIS_ADMIN_KEY", "");
    vi.stubEnv("RBXIS_SESSION_SECRET", "");

    expect(getAdminAccessKey()).toBe("");
    expect(readSessionToken(token)).toBeNull();
    expect(() => createSessionToken({ role: "admin", username: "test" })).toThrow("RBXIS_SESSION_SECRET must be configured");
  });

  it("accepts the signed session through an Authorization bearer header", () => {
    const token = createSessionToken({ role: "admin", username: "Ferraodev" });
    const session = readSessionFromRequest({ headers: { authorization: `Bearer ${token}` } } as never);
    expect(session?.role).toBe("admin");
  });
});
