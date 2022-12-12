import { Task } from '~/app'
import { rest } from 'msw'

let tasks: Task[] = [
  { id: 'clbl5nx0b00002e644yc596az', name: 'Primeira tarefa' },
]

export const handlers = [
  rest.get('/tasks', (_req, res, ctx) => {
    // Retorna lista de tarefas
    return res(ctx.status(200), ctx.json(tasks))
  }),
  rest.post('/tasks', async (req, res, ctx) => {
    // Adiciona tarefa
    const data = await req.json<Task>()

    tasks.push(data)

    return res(ctx.status(201), ctx.json(data))
  }),
  rest.put('/tasks', async (req, res, ctx) => {
    // Atualizar tarefa
    const data = await req.json<Task>()

    const updatedTask = tasks.filter((t) => t.id === data.id)?.[0]

    if (!updatedTask) {
      return res(ctx.status(404))
    }

    const newTasks: Task[] = tasks.map((t) => {
      if (t.id === data.id) {
        t.name = data.name
      }

      return t
    })

    tasks = newTasks

    return res(ctx.status(200), ctx.json(tasks))
  }),
  rest.delete('/tasks', async (req, res, ctx) => {
    // Excluir uma tarefa
    const data = await req.json<Omit<Task, 'name'>>()

    const newTasks: Task[] = tasks.filter((t) => t.id !== data.id)

    tasks = newTasks

    return res(ctx.status(200), ctx.json(tasks))
  }),
]
