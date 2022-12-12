import { useEffect, useRef, useState } from 'react'

import cuid from 'cuid'
import { z } from 'zod'

const schema = z.object({
  id: z.string().cuid(),
  name: z.string(),
})

export type Task = z.infer<typeof schema>

const getTasks = (
  onSuccess: (data: Task[]) => void,
  onError: (error: Error) => void,
) =>
  fetch('/tasks')
    .then((res) => res.json())
    .then((res) => {
      onSuccess?.(res)
    })
    .catch((error) => {
      onError(error)
    })

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchTasks = () =>
    getTasks(
      (t) => setTasks(t),
      (error) => setError(error.message),
    )

  useEffect(() => {
    fetchTasks()
  }, [])

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

          fetch('/tasks', { method: 'POST', body: JSON.stringify(newTask) })
            .then((res) => res.json())
            .then((res) => {
              console.log(res)
              setTasks((currentState) => [...currentState, res])
            })
            .catch((error) => {
              setError(error.message)
            })

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
          <li key={task.id}>
            <TaskItem
              id={task.id}
              name={task.name}
              onError={setError}
              onSuccess={fetchTasks}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

type TaskItemProps = {
  onSuccess: () => void
  onError: (message: string) => void
} & Task

function TaskItem({ id, name, onError, onSuccess }: TaskItemProps) {
  const [readOnly, setReadOnly] = useState(true)
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const updatedTask = { id, name: formData.get('task')?.toString() }

        // Serializando o formData
        // console.log(Object.fromEntries(formData))

        fetch('/tasks', {
          method: 'PUT',
          body: JSON.stringify(updatedTask),
        })
          .then(() => {
            onSuccess()
            cancelRef?.current?.click()
          })
          .catch((e) => onError(e.message))
      }}
    >
      <input
        name="task"
        id="task"
        defaultValue={name}
        readOnly={readOnly}
        required
      />

      <button
        type="button"
        onClick={() => {
          fetch('/tasks', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
          })
            .then(() => {
              onSuccess()
            })
            .catch((e) => onError(e.message))
        }}
      >
        -
      </button>
      <button
        type="button"
        onClick={() => {
          setReadOnly(!readOnly)
        }}
        ref={cancelRef}
      >
        {readOnly ? 'Editar' : 'Cancelar'}
      </button>
      {!readOnly ? <button type="submit">Salvar</button> : null}
    </form>
  )
}
