import css from './NoteList.module.css';
import type { Note } from '../../types/note';

interface NoteListProps {
  notes: Note[];
}

function NoteList({ notes }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button type="button" className={css.button}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
