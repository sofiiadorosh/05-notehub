import axios from 'axios';
import type { Note } from '../types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const NOTEHUB = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export async function fetchNotes(
  query: string,
  page: number,
): Promise<FetchNotesResponse> {
  const { data } = await NOTEHUB.get<FetchNotesResponse>('/notes', {
    params: { search: query, page, perPage: 12 },
  });
  return data;
}

export async function createNote(
  note: Pick<Note, 'title' | 'content' | 'tag'>,
): Promise<Note> {
  const { data } = await NOTEHUB.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await NOTEHUB.delete<Note>(`/notes/${id}`);
  return data;
}
