import { useRef, useState } from 'react'

import cuid from 'cuid'
import { z } from 'zod'

const schema = z.object({
  id: z.string().cuid(),
  name: z.string(),
})

type Task = z.infer<typeof schema>

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      {error ? <p>{error}</p> : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)

          const newTask = {
            id: cuid(),
            name: formData.get('task')?.toString() || '',
          }

          if (!schema.safeParse(newTask).success) {
            setError('Ocorreu um erro na validação do formulário')
            return
          }

          setTasks((currentState) => [...currentState, newTask])

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
