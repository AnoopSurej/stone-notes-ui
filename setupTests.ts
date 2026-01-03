import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Type-safe global polyfills for Node.js testing environment
(globalThis as typeof globalThis & { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(globalThis as typeof globalThis & { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder;
