# NoteHub

A React + TypeScript app for keeping personal notes. You can browse your notes
page by page, search them by keyword, create new notes in a modal form and
delete the ones you no longer need. Notes are stored on the
[NoteHub API](https://notehub-public.goit.study/api/docs), and server data is
fetched and cached with [TanStack Query](https://tanstack.com/query/latest).

**Live demo:** _coming soon_

## Features

- Your notes are shown as soon as the app loads
- Pagination with 12 notes per page, shown only when there is more than one
  page
- Search by keyword with a 300 ms debounce, so a request is not sent on every
  keystroke; a new search resets the page to 1
- The current notes stay on screen while the next page or search result is
  loading
- Create a note in a modal form with a title, content and tag (Todo, Work,
  Personal, Meeting or Shopping)
- Form validation: the title is required and 3–50 characters long, the content
  is up to 500 characters, and the tag must be one of the allowed values
- The submit button is disabled while the note is being created, and the modal
  closes after the note is saved
- Delete a note with one click; the Delete buttons are disabled while the
  request is in progress
- After deleting the last note on a page, the app moves to the previous page
- The note list refreshes automatically after a note is created or deleted
- Loading indicator, error message and a "No notes found" message for empty
  results
- The modal closes on the Cancel button, the Escape key or a backdrop click,
  and blocks page scrolling while it is open

## Tech stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) with React Compiler
- [TanStack Query](https://tanstack.com/query/latest) for fetching, caching and
  updating server data, with React Query Devtools in development
- [axios](https://axios-http.com/) for HTTP requests
- [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup) for
  the note form and its validation
- [React Paginate](https://github.com/AdeleD/react-paginate) for pagination
- [use-debounce](https://github.com/xnimorz/use-debounce) for the debounced
  search
- CSS Modules and [modern-normalize](https://github.com/sindresorhus/modern-normalize)
- ESLint, Prettier, Husky and lint-staged
- [Vercel](https://vercel.com/) for deployment

## How data fetching works

- `QueryClient` and `QueryClientProvider` are set up in `src/main.tsx`.
- `App` calls `useQuery` with the key `['notes', query, page]`, so every search
  query and page is cached separately.
- `placeholderData: keepPreviousData` keeps the previous notes visible while
  the next ones are loading.
- Creating and deleting notes use `useMutation`. On success, both call
  `invalidateQueries({ queryKey: ['notes'] })`, so every cached page and
  search result is fetched again.
- `useDebouncedCallback` in `App` updates the search query 300 ms after the
  user stops typing.

## Project structure

```
src/
  components/
    App/            # search, page and modal state, queries and mutations
    SearchBox/      # search input
    NoteList/       # list of note cards with Delete buttons
    Pagination/     # page switcher built on React Paginate
    Modal/          # reusable modal rendered with a portal
    NoteForm/       # Formik form for creating a note with Yup validation
    Loader/         # loading message
    ErrorMessage/   # error message
    EmptyMessage/   # message when there are no notes or no search results
  services/
    noteService.ts  # NoteHub axios instance and fetchNotes, createNote, deleteNote
  types/
    note.ts         # shared Note, NoteTag and NewNote types
  index.css         # global styles
  main.tsx          # entry point with QueryClientProvider
```

## Getting started

Requirements: Node.js 24+ and npm.

1. Get a personal access token in the
   [NoteHub API docs](https://notehub-public.goit.study/api/docs) (the
   `POST /auth` route). When a token is created, 40 test notes are added to
   your collection.
2. Create a `.env` file in the project root:

   ```
   VITE_NOTEHUB_TOKEN=your_token
   ```

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

The app runs at http://localhost:5173/.

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the dev server                 |
| `npm run build`        | Type-check and build for production  |
| `npm run preview`      | Preview the production build locally |
| `npm run lint`         | Run ESLint                           |
| `npm run lint:fix`     | Run ESLint and fix problems          |
| `npm run format`       | Format all files with Prettier       |
| `npm run format:check` | Check formatting with Prettier       |

A pre-commit hook runs ESLint and Prettier on staged files.

## Deployment

The app is deployed on Vercel. Every push to `main` triggers a new production
build and deploy. The `VITE_NOTEHUB_TOKEN` environment variable must be set in
the Vercel project settings.
