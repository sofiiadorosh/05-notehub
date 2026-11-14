import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

function App() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [isModalOpened, setModalOpened] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', query, selectedPage],
    queryFn: () => fetchNotes(query, selectedPage),
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

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
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
      {isSuccess && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={deleteNoteMutation.mutate}
          isDeleting={deleteNoteMutation.isPending}
        />
      )}
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
