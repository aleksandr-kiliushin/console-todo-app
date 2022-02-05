import * as lowdb from "lowdb"
import * as FileSync from "lowdb/adapters/FileSync"

import TodoCollection from "./TodoCollection"
import TodoItem from "./todoItem"

type SchemaType = {
  tasks: TodoItem[]
}

class JsonTodoCollection extends TodoCollection {
  private database: lowdb.LowdbSync<SchemaType>

  constructor(public userName: string, todoItems: TodoItem[] = []) {
    super(userName, [])

    this.database = lowdb(new FileSync("todos.json"))

    if (this.database.has("tasks").value()) {
      const dbItems = this.database.get("tasks").value()
      dbItems.forEach(({ completed, id, task }) => {
        this.itemMap.set(id, new TodoItem(id, task, completed))
      })
    } else {
      this.database.set("tasks", todoItems).write()
      todoItems.forEach((item) => {
        this.itemMap.set(item.id, item)
      })
    }
  }

  addTodo(task: string): number {
    const result = super.addTodo(task)
    this.storeTasks()
    return result
  }

  markComplete(id: number, completed: boolean): void {
    super.markComplete(id, completed)
    this.storeTasks()
  }

  removeCompleted(): void {
    super.removeCompleted()
    this.storeTasks()
  }

  storeTasks(): void {
    this.database.set("tasks", [...this.itemMap.values()]).write()
  }
}

export default JsonTodoCollection
