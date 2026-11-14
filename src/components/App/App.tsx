import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

function App() {
  const [query, setQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState(1);
  const [isModalOpened, setModalOpened] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ['notes', query, selectedPage],
    queryFn: () => fetchNotes(query, selectedPage),
    placeholderData: keepPreviousData,
  });

  const onModalOpen = () => {
    setModalOpened(true);
  };

  const onModalClose = () => {
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
        <button className={css.button} type="button" onClick={onModalOpen}>
          Create note +
        </button>
      </header>
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpened && (
        <Modal onClose={onModalClose}>
          <NoteForm onCancel={onModalClose} />
        </Modal>
      )}
    </div>
  );
}

export default App;
