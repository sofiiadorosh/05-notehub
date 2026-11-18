import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import EmptyMessage from '../EmptyMessage/EmptyMessage';
import css from './App.module.css';

function App() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [isModalOpened, setModalOpened] = useState(false);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, selectedPage],
    queryFn: () => fetchNotes({ search: query, page: selectedPage }),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      handleModalClose();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      if (data?.notes.length === 1 && selectedPage > 1) {
        setSelectedPage(selectedPage - 1);
      }
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleModalOpen = () => {
    setModalOpened(true);
  };

  const handleModalClose = () => {
    setModalOpened(false);
  };

  const handleSearchNotes = useDebouncedCallback((query: string) => {
    setQuery(query);
    setSelectedPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearchNotes} />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            pages={data.totalPages}
            selectedPage={selectedPage}
            onPageChange={setSelectedPage}
          />
        )}
        <button className={css.button} type="button" onClick={handleModalOpen}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isSuccess && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={deleteNoteMutation.mutate}
          isDeleting={deleteNoteMutation.isPending}
        />
      )}
      {isSuccess && data.notes.length === 0 && <EmptyMessage query={query} />}
      {isError && <ErrorMessage />}
      {isModalOpened && (
        <Modal onClose={handleModalClose}>
          <NoteForm
            onCancel={handleModalClose}
            onSubmit={createNoteMutation.mutate}
            isSubmitting={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
