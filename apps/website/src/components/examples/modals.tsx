import { observer, useObserver } from 'rosma';
import { Modal } from '../../types/global';

observer.setStatics({
  newModal({ id, body, title }) {
    const modals = this.state.modals;
    const modal = { id: id ?? modals.length + 1, title, body };

    modals.push(modal);

    this.set({ modals: [...modals] });
  },
  closeModal(id) {
    const modals = this.state.modals;

    this.set({ modals: modals.filter((modal) => modal.id !== id) });
  },
});

export function App() {
  const { newModal } = useObserver();

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

  return (
    <>
      {modals.map((modal, index) => (
        <Modal key={index} {...modal} />
      ))}
    </>
  );
}

function Modal({ title, body, id }: Modal) {
  const { closeModal } = useObserver([]);

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
        zIndex: 1,
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
