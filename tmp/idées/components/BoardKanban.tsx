// BoardKanban.tsx - basic kanban board prototype
import React, { useState } from 'react';

const columns = ['À faire', 'En cours', 'Terminé'];

const BoardKanban = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Candidature pour Job 1', status: 'À faire' },
        { id: 2, title: 'Relancer RH', status: 'En cours' },
        { id: 3, title: 'Préparer entretien', status: 'Terminé' },
    ]);

    const moveTask = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {columns.map(col => (
                <div key={col} style={{ width: 200, padding: 10, border: '1px solid #ccc' }}>
                    <h3>{col}</h3>
                    {tasks.filter(t => t.status === col).map(task => (
                        <div key={task.id} style={{ margin: '8px 0', padding: 8, background: '#eee' }}>
                            <div>{task.title}</div>
                            {columns.filter(c => c !== col).map(c => (
                                <button key={c} onClick={() => moveTask(task.id, c)} style={{ margin: '0 4px' }}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BoardKanban;
