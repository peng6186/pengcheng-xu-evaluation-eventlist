/**
 * @file index.js
 * @author: Pengcheng Xu
 * @modifed : 06/02/2023
 * @version 1.0.0
 * This is for SEP Eval Project. This file implements interactions (e.g. addEvent, editEvent, deleteEvent... etc.) on the html page
 * In the following context, we use a todo refering to an evernoe event (cuz event sometimes conflicts with event in eventHandler, just to avoid cofusion).
 */

/* Define a json server api */
const serverApi = (function () {
  const API = "http://localhost:3000/events";

  async function fetchData() {
    const resp = await fetch(API);
    const data = await resp.json();
    return data;
  }

  // return the created data
  async function postData(todo) {
    // console.log(todo);
    const resp = await fetch(API, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(todo),
    });
    const data = await resp.json();
    //   console.log(data);
    return data;
  }

  // return the updated data
  async function putData(todo) {
    console.log(todo);
    const resp = await fetch(`${API}/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(todo),
    });
    const data = await resp.json();
    console.log("data:", data);
    return data;
  }

  // return {}
  async function deleteData(id) {
    const resp = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    const data = await resp.json();
    return data;
  }

  return {
    fetchData,
    postData,
    putData,
    deleteData,
  };
})();

/** MVC Design **/

/* Model Part */
class TodoModel {
  #todos = [];
  constructor() {}

  getTodos() {
    return this.#todos;
  }
  async fetchTodos() {
    this.#todos = await serverApi.fetchData();
  }
  async addNewTodo(todo) {
    const newTodo = await serverApi.postData(todo);

    this.#todos.push(newTodo);
    return newTodo;
  }
  async deleteTodo(id) {
    // console.log(id);
    await serverApi.deleteData(id);
    this.#todos = this.#todos.filter((t) => t.id != id);
  }

  async updateTodo(updatedTodo) {
    let todo = this.findTodo(updatedTodo.id);
    todo.eventName = updatedTodo.eventName;
    todo.startDate = updatedTodo.startDate;
    todo.endDate = updatedTodo.endDate;

    return await serverApi.putData(updatedTodo);
  }

  findTodo(id) {
    // console.log(typeof id);
    const todos = this.#todos.filter((todo) => {
      // console.log(todo);
      return todo.id === +id;
    });
    // console.log(todos);
    return todos[0];
  }
}

/* View Part */
class TodoView {
  constructor() {
    this.addBtn = document.querySelector(
      ".event-app .addBtnWrapper .addEventBtn"
    );
    this.eventsContainer = document.querySelector("tbody");
  }
  appendTodo(todo) {
    const todoElm = this.createTodoShowElm(todo);
    this.eventsContainer.appendChild(todoElm);
  }

  createInitalTodoAddElm() {
    const eventElm = document.createElement("tr");
    eventElm.classList.add("create-row", "initalAdd");

    eventElm.innerHTML = `
    <td>
                <input type="text" name="content" id="content" required/>
              </td>
              <td><input type="date" name="startDate" id="startDate" required /></td>
              <td><input type="date" name="endDate" id="endDate" required /></td>
              <td>
                <div class="actions">
                  <button class="edit-btn" style="display: none">
                    <svg
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="EditIcon"
                      aria-label="fontSize small"
                    >
                      <path fill="white"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      ></path>
                    </svg>
                  </button>
                  <button class="delete-btn" style="display: none">
                    <svg
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="DeleteIcon"
                      aria-label="fontSize small"
                    >
                      <path fill="white"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      ></path>
                    </svg>
                  </button>
                  <button class="save-btn" style="display: none" > <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg></button>
                  <button class="plus-btn"  ><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                  <button class="cancel-btn" >
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                  </button>
                </div>
              </td>
    `;

    // console.log(eventElm);
    return eventElm;
  }
  createChangableTodoElm(todo) {
    const eventElm = document.createElement("tr");
    eventElm.classList.add("create-row");
    eventElm.setAttribute("id", `change-${todo.id}`);

    eventElm.innerHTML = `
    <td>
                <input type="text" name="content" id="content" value='${todo.eventName}' required/>
              </td>
              <td><input type="date" name="startDate" id="startDate" value=${todo.startDate} required /></td>
              <td><input type="date" name="endDate" id="endDate" value=${todo.endDate} required /></td>
              <td>
                <div class="actions">
                  <button class="edit-btn" style="display: none" edit-id=${todo.id}>
                    <svg
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="EditIcon"
                      aria-label="fontSize small"
                    >
                      <path fill="white"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      ></path>
                    </svg>
                  </button>
                  <button class="delete-btn" style="display: none" delete-id=${todo.id}>
                    <svg
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="DeleteIcon"
                      aria-label="fontSize small"
                    >
                      <path fill="white"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                      ></path>
                    </svg>
                  </button>
                  <button class="save-btn" save-id=${todo.id}> <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg></button>
                  <button class="plus-btn" style="display: none" plus-id=${todo.id} ><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                  <button class="cancel-btn" cancel-id=${todo.id}>
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                  </button>
                </div>
              </td>
    `;

    // console.log(eventElm);
    return eventElm;
  }

  createTodoShowElm(todo) {
    // console.log(todo);
    const todoElm = document.createElement("tr");
    todoElm.classList.add("event-item");
    todoElm.setAttribute("id", `show-${todo.id}`);
    todoElm.innerHTML = `
    <td>${todo.eventName}</td>
    <td>${todo.startDate}</td>
    <td>${todo.endDate}</td>
    <td>
      <div class="actions">
        <button class="edit-btn" edit-id=${todo.id} >
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="EditIcon"
            aria-label="fontSize small"
          >
            <path fill="white"
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            ></path>
          </svg>
        </button>
        <button class="delete-btn" delete-id=${todo.id}>
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="DeleteIcon"
            aria-label="fontSize small"
          >
            <path fill="white"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            ></path>
          </svg>
        </button>
        <button class="save-btn" style="display: none" save-id=${todo.id}> <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg></button>
        <button class="plus-btn" style="display: none" plus-id=${todo.id}><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button class="cancel-btn" style="display: none" cancel-id=${todo.id}>
          <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
        </button>
      </div>
    </td>
          `;
    return todoElm;
  }

  deleteTodoElm(id) {
    const elem = document.querySelector(`#show-${id}`);
    elem.remove();
  }

  initialRender(todos) {
    // console.log(this.eventsContainer);
    todos.forEach((todo) => {
      const todoElm = this.createTodoShowElm(todo);
      this.eventsContainer.appendChild(todoElm);
    });
  }
}

/* Controller Part */
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async init() {
    // initialize model
    await this.model.fetchTodos();
    // initialize view
    this.view.initialRender(this.model.getTodos());
    // initialize event handlers
    await this.setEventHandlers();
  }

  async setEventHandlers() {
    // addBtn
    this.setAddBtn();
    // all events in the show list
    this.setBtnsInShowList();
  }

  setAddBtn() {
    // okay
    this.view.addBtn.addEventListener("click", (e) => {
      // console.log("click");
      const initialAddElm = this.view.createInitalTodoAddElm();
      this.view.eventsContainer.appendChild(initialAddElm);
    });
  }

  setBtnsInShowList() {
    // plusBtn
    this.view.eventsContainer.addEventListener("click", (e) => {
      const isDeleteBtn = e.target.classList.contains("delete-btn");
      const isEditBtn = e.target.classList.contains("edit-btn");
      const isPlusBtn = e.target.classList.contains("plus-btn");
      const isCancelBtn = e.target.classList.contains("cancel-btn");
      const isSaveBtn = e.target.classList.contains("save-btn");

      if (isPlusBtn) {
        // ok
        const initialTodoAddElm = e.target.parentNode.parentNode.parentNode;
        this.setUpPlusBtn(initialTodoAddElm);
      } else if (isDeleteBtn) {
        // okay
        const id = e.target.getAttribute("delete-id");
        this.setUpDeleteBtn(id);
      } else if (isEditBtn) {
        // okay
        const todoShowElm = e.target.parentNode.parentNode.parentNode;
        const id = e.target.getAttribute("edit-id");
        this.setUpEditBtn(id, todoShowElm);
      } else if (isSaveBtn) {
        const id = e.target.getAttribute("save-id");
        const changableEle = e.target.parentNode.parentNode.parentNode;
        this.setUpSaveBtn(id, changableEle);
      } else if (isCancelBtn) {
        const changableElm = e.target.parentNode.parentNode.parentNode;
        this.setUpCancelBtn(changableElm, e);
      }
    });
  }

  setUpPlusBtn(initialTodoAddElm) {
    const contentElm = initialTodoAddElm.querySelector("#content");
    const startElm = initialTodoAddElm.querySelector("#startDate");
    const endElm = initialTodoAddElm.querySelector("#endDate");

    // input is required
    if (
      contentElm.value === "" ||
      startElm.value === "" ||
      endElm.value === ""
    ) {
      alert("Input Not Valid!");
      return;
    }

    const newEvent = {
      eventName: contentElm.value,
      startDate: startElm.value,
      endDate: endElm.value,
    };

    this.model.addNewTodo(newEvent).then((todo) => {
      const todoShowElm = this.view.createTodoShowElm(todo);
      this.view.eventsContainer.insertBefore(todoShowElm, initialTodoAddElm);
      initialTodoAddElm.remove();
    });
  }

  setUpDeleteBtn(id) {
    this.model.deleteTodo(id).then(() => {
      this.view.deleteTodoElm(id);
    });
  }

  setUpEditBtn(id, todoShowElm) {
    const todo = this.model.findTodo(id);
    const changableEle = this.view.createChangableTodoElm(todo);
    this.view.eventsContainer.insertBefore(changableEle, todoShowElm);
    todoShowElm.style.display = "none";
  }

  setUpSaveBtn(id, changableEle) {
    const hiddenElm = this.view.eventsContainer.querySelector(`#show-${id}`);
    hiddenElm.remove();

    const contentElm = changableEle.querySelector("#content");
    const startElm = changableEle.querySelector("#startDate");
    const endElm = changableEle.querySelector("#endDate");
    const updatedTodo = {
      eventName: contentElm.value,
      startDate: startElm.value,
      endDate: endElm.value,
      id: id,
    };
    this.model.updateTodo(updatedTodo).then((updatedTodo) => {
      const showElm = this.view.createTodoShowElm(updatedTodo);
      this.view.eventsContainer.insertBefore(showElm, changableEle);
      changableEle.remove();
    });
  }

  setUpCancelBtn(changableElm, e) {
    if (!changableElm.classList.contains("initalAdd")) {
      // if the row is not intial add elm
      const id = e.target.getAttribute("cancel-id");
      // console.log(id);
      const hiddenShowElm = this.view.eventsContainer.querySelector(
        `#show-${id}`
      );
      // console.log(hiddenShowElm);
      hiddenShowElm.style.display = "table-row";
    }
    changableElm.remove();
  }
}

/* Active the app */
const todoModel = new TodoModel();
const todoView = new TodoView();
const todoCon = new TodoController(todoModel, todoView);
