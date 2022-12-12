import { useState } from 'react'

type Task = {
  id: string
  name: string
}

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          setTasks((currentState) => [
            ...currentState,
            {
              id: 'asdfafq',
              name: formData.get('tasks')?.toString() || '',
            },
          ])
        }}
      >
        <label htmlFor="task">Adicionar tarefa:</label>
        <br />
        <input name="task" id="task" />
        <button type="submit">+</button>
      </form>

      <ul>
        {tasks?.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  )
}
