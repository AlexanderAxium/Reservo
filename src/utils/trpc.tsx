"use client";

// Re-export the single tRPC instance from the provider module
// so all components share the same React Query context.
export { trpc } from "@/hooks/useTRPC";
