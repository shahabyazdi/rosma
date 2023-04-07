import { observer, useObserver } from 'rosma';

export function App() {
  return (
    <>
      <button
        onClick={() => newModal({ title: 'Modal title', body: 'Modal body' })}
      >
        Open Modal
      </button>
      <Modals />
    </>
  );
}

function Modals() {
  const { modals } = useObserver([]);

  return modals.map((modal, index) => <Modal key={index} {...modal} />);
}

function Modal({ title, body, id }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        boxShadow: '0 0 5px #ccc',
        minWidth: '300px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '7px',
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: '10px',
          borderBottom: '1px solid #ccc',
          gap: '5px',
        }}
      >
        <span>{title}</span>
        <span>#{id}</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => closeModal(id)}>x</button>
      </div>
      <div style={{ padding: '10px' }}>{body}</div>
    </div>
  );
}

function newModal({ title, body }) {
  const modals = observer.get('modals') || [];

  const modal = {
    id: modals.length + 1,
    title,
    body,
  };

  modals.push(modal);

  observer.set({ modals });
}

function closeModal(id) {
  const modals = observer.get('modals') || [];

  observer.set({ modals: modals.filter((modal) => modal.id !== id) });
}
