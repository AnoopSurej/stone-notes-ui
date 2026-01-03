import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import { config } from "@/lib/config";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface UpdateNoteDto {
  title: string;
  content: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
}

interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const notesKeys = {
  all: ["notes"] as const,
  detail: (id: number) => ["notes", id] as const,
};

export function useNotes(page = 0, size = 100) {
  const auth = useAuth();

  return useQuery({
    queryKey: [...notesKeys.all, page, size],
    queryFn: async (): Promise<Note[]> => {
      const { data } = await axios.get<ApiResponse<Page<Note>>>(`${config.apiUrl}/api/notes`, {
        params: { page, size, sortBy: "createdAt", sortDir: "desc" },
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      return data.data.content;
    },
    enabled: !!auth.user?.access_token,
  });
}

export function useNote(id: number) {
  const auth = useAuth();

  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: async (): Promise<Note> => {
      const { data } = await axios.get<ApiResponse<Note>>(`${config.apiUrl}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      return data.data;
    },
    enabled: !!auth.user?.access_token && !!id,
  });
}

export function useCreateNote() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: CreateNoteDto): Promise<Note> => {
      const { data } = await axios.post<ApiResponse<Note>>(`${config.apiUrl}/api/notes`, newNote, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKeys.all });
    },
  });
}

export function useUpdateNote() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateNoteDto & { id: number }): Promise<Note> => {
      const { data } = await axios.put<ApiResponse<Note>>(
        `${config.apiUrl}/api/notes/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
          },
        }
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: notesKeys.all });
      void queryClient.invalidateQueries({ queryKey: notesKeys.detail(variables.id) });
    },
  });
}

export function useDeleteNote() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete<ApiResponse<void>>(`${config.apiUrl}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesKeys.all });
    },
  });
}
