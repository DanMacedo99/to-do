import { useRef, useState } from 'react'

import cuid from 'cuid'

type Task = {
  id: string
  name: string
}

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          setTasks((currentState) => [
            ...currentState,
            {
              id: cuid(),
              name: formData.get('task')?.toString() || '',
            },
          ])

          if (inputRef.current?.value) {
            inputRef.current.value = ''
          }
        }}
      >
        <label htmlFor="task">Adicionar tarefa:</label>
        <br />
        <input name="task" id="task" ref={inputRef} />
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
