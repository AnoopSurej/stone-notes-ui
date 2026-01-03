import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import axios from "axios";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "./useNotes";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUser = {
  access_token: "test-token-123",
};

jest.mock("react-oidc-context", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
  }),
}));

jest.mock("@/lib/config", () => ({
  config: {
    apiUrl: "http://localhost:8080",
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useNotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch notes successfully", async () => {
    const mockNotes = [
      {
        id: 1,
        title: "Test Note",
        content: "Test Content",
        createdAt: "2024-01-01T00:00:00",
        updatedAt: "2024-01-01T00:00:00",
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          content: mockNotes,
        },
      },
    });

    const { result } = renderHook(() => useNotes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockNotes);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/notes",
      expect.objectContaining({
        params: { page: 0, size: 100, sortBy: "createdAt", sortDir: "desc" },
        headers: { Authorization: "Bearer test-token-123" },
      })
    );
  });

  it("should handle fetch error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useNotes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe("useCreateNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a note successfully", async () => {
    const newNote = { title: "New Note", content: "New Content" };
    const createdNote = {
      id: 1,
      ...newNote,
      createdAt: "2024-01-01T00:00:00",
      updatedAt: "2024-01-01T00:00:00",
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: createdNote,
      },
    });

    const { result } = renderHook(() => useCreateNote(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(newNote);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/notes",
      newNote,
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token-123" },
      })
    );
  });

  it("should handle create error", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Create failed"));

    const { result } = renderHook(() => useCreateNote(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync({ title: "Test", content: "Test" })).rejects.toThrow(
      "Create failed"
    );
  });
});

describe("useUpdateNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a note successfully", async () => {
    const updateData = { id: 1, title: "Updated", content: "Updated content" };
    const updatedNote = {
      ...updateData,
      createdAt: "2024-01-01T00:00:00",
      updatedAt: "2024-01-01T01:00:00",
    };

    mockedAxios.put.mockResolvedValueOnce({
      data: {
        success: true,
        data: updatedNote,
      },
    });

    const { result } = renderHook(() => useUpdateNote(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(updateData);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:8080/api/notes/1",
      { title: "Updated", content: "Updated content" },
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token-123" },
      })
    );
  });
});

describe("useDeleteNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a note successfully", async () => {
    mockedAxios.delete.mockResolvedValueOnce({
      data: {
        success: true,
        data: null,
      },
    });

    const { result } = renderHook(() => useDeleteNote(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:8080/api/notes/1",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token-123" },
      })
    );
  });
});
