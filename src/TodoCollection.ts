import TodoItem from "./todoItem"

type ItemCounts = {
  incompleted: number
  total: number
}

class TodoCollection {
  private nextId: number = 1
  protected itemMap = new Map<number, TodoItem>()

  constructor(public userName: string, public todoItems: TodoItem[] = []) {
    todoItems.forEach((todoItem) => this.itemMap.set(todoItem.id, todoItem))
  }

  addTodo(task: string): number {
    while (this.getTodoById(this.nextId)) {
      this.nextId++
    }
    this.itemMap.set(this.nextId, new TodoItem(this.nextId, task))
    return this.nextId++
  }

  getTodoById(id: number): TodoItem {
    return this.itemMap.get(id)
  }

  getTodoItems(includeComplete?: boolean): TodoItem[] {
    const items = [...this.itemMap.values()]
    if (includeComplete === undefined) return items
    return items.filter(({ completed }) => completed === includeComplete)
  }

  markComplete(id: number, completed: boolean): void {
    const todoItem = this.getTodoById(id)
    if (todoItem === undefined) return
    todoItem.completed = completed
  }

  removeCompleted(): void {
    this.itemMap.forEach(({ completed }, key) => {
      if (completed) this.itemMap.delete(key)
    })
  }

  getItemCounts(): ItemCounts {
    return {
      incompleted: this.getTodoItems(false).length,
      total: this.itemMap.size,
    }
  }
}

export default TodoCollection
