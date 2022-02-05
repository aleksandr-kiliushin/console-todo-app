import * as inquirer from "inquirer"

import JsonTodoCollection from "./JsonTodoCollection"
// import TodoCollection from "./TodoCollection"
import TodoItem from "./TodoItem"

const todos: TodoItem[] = [
  new TodoItem(1, "Reading a book."),
  new TodoItem(2, "Resolve 10 Codewars tasks.", true),
  new TodoItem(3, "Go for run.", true),
  new TodoItem(4, "Have a shower."),
]

const collection: JsonTodoCollection = new JsonTodoCollection("Alexander", todos)

// const newId: number = collection.addTodo("Go for a walk with the dog.")
// const todoItem: TodoItem = collection.getTodoById(newId)

let includeCompleted: boolean

const displayTodoList = () => {
  console.log(`Alexander's to-do list (${collection.getItemCounts().incompleted} items to do).`)
  collection.getTodoItems(includeCompleted).forEach((todoItem) => todoItem.printDetails())
}

enum Commands {
  Add = "Add a new task",
  Complete = "Complete task",
  Purge = "Remove completed tasks",
  Quit = "Quit",
  Toggle = "Show / Hide completed",
}

const promptUser = (): void => {
  console.clear()
  displayTodoList()
  inquirer
    .prompt({
      choices: Object.values(Commands),
      message: "Choose option",
      name: "command",
      type: "list",
    })
    .then((answers) => {
      switch (answers.command) {
        case Commands.Toggle:
          includeCompleted = !includeCompleted
          promptUser()
          break
        case Commands.Add:
          promptAdd()
          break
        case Commands.Complete:
          if (collection.getItemCounts().incompleted === 0) {
            console.log("All tasks are already completed.")
            promptUser()
            break
          }
          promptCompleted()
          break
        case Commands.Purge:
          collection.removeCompleted()
          promptUser()
          break
      }
    })
}

const promptAdd = () => {
  console.clear()
  inquirer
    .prompt({
      name: "add",
      type: "input",
      message: "Enter task:",
    })
    .then((answers) => {
      if (answers.add !== "") {
        collection.addTodo(answers["add"])
        promptUser()
      }
    })
}

const promptCompleted = () => {
  console.clear()
  inquirer
    .prompt({
      type: "checkbox",
      name: "completed",
      message: "Mark completed tasks",
      choices: collection
        .getTodoItems()
        .map(({ completed, id, task }) => ({ checked: completed, name: task, value: id })),
    })
    .then((answers) => {
      const completedTasks: number[] = answers.completed
      collection.getTodoItems().forEach(({ id }) => {
        if (!completedTasks.includes(id)) return
        collection.markComplete(id, true)
      })
      promptUser()
    })
}

promptUser()
