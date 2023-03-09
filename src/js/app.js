function addNewUser() {
  document.getElementById("addBtn").addEventListener("click", () => {
    closeForm();
    closeUserView();
    document.getElementById("addForm").classList.remove("hidden");
    document.getElementById("saveBtn").classList.remove("hidden");
  });
}

function openEditUser() {
  closeUserView();
  document.getElementById("addForm").classList.remove("hidden");
  document.getElementById("editBtn").classList.remove("hidden");
}

function closeUserView() {
  document.getElementById("userView").innerHTML = "";
}

function closeForm() {
  document.getElementById("addForm").classList.add("hidden");
  document.getElementById("saveBtn").classList.add("hidden");
  document.getElementById("editBtn").classList.add("hidden");
  document.form.name.value = "";
  document.form.lastName.value = "";
  document.form.email.value = "";
}

function saveValidate() {
  if (!document.form.name.value || !document.form.lastName.value || !document.form.email.value) {
    const errorBlock = createElement(
      "div",
      "Error",
      { className: "error" },
      { click: { callback: returnToForm } },
      "body"
    );
    function returnToForm() {
      errorBlock.classList.remove("error");
      errorBlock.classList.add("hidden");
      document.getElementById("addForm").classList.remove("hidden");
    }
  } else {
    pushUser();
  }
}

function pushUser() {
  const tempObj = {};
  tempObj.id = Date.now();
  tempObj.name = document.form.name.value;
  tempObj.lastName = document.form.lastName.value;
  tempObj.email = document.form.email.value;
  users.push(tempObj);
}

function saveUser() {
  document.getElementById("saveBtn").addEventListener("click", () => {
    closeUserView();
    saveValidate();
    document.getElementById("usersList").innerHTML = "";
    showUsers();
    closeForm();
    localStorage.setItem('users', JSON.stringify(users));
  });
}

function editValidate() {
  if (!document.form.name.value || !document.form.lastName.value || !document.form.email.value) {
    const errorBlock = createElement(
      "div",
      "Error",
      { className: "error" },
      { click: { callback: returnToForm } },
      "body"
    );
    function returnToForm() {
      errorBlock.classList.remove("error");
      errorBlock.classList.add("hidden");
      document.getElementById("addForm").classList.remove("hidden");
    }
  } else {
    user.name = document.form.name.value;
    user.lastName = document.form.lastName.value;
    user.email = document.form.email.value;
  }
}

function editUser() {
  document.getElementById("editBtn").addEventListener("click", () => {
    closeUserView();
    editValidate();
    document.getElementById("usersList").innerHTML = "";
    showUsers();
    closeForm();
  });
}

function showUsersListHeader() {
  const headerDiv = createElement("div", "", null, null, "#usersList");
  headerDiv.classList.add("header"), createElement("div", "Full name", null, null, headerDiv);
  createElement("div", "Actions", null, null, headerDiv);
}

function viewUserHandler(user) {
  closeForm();
  const parentSelector = "#userView";
  clearContent(parentSelector);
  createElement("div", `Name: ${user.name}`, null, null, parentSelector);
  createElement("div", `Last name: ${user.lastName}`, null, null, parentSelector);
  createElement("div", `Email: ${user.email}`, null, null, parentSelector);
}

function editUserHandler(user) {
  closeForm();
  closeUserView();
  openEditUser();
  document.form.name.value = user.name;
  document.form.lastName.value = user.lastName;
  document.form.email.value = user.email;
  document.getElementById("editBtn").addEventListener("click", () => {
    closeUserView();
    user.name = document.form.name.value;
    user.lastName = document.form.lastName.value;
    user.email = document.form.email.value;
    document.getElementById("usersList").innerHTML = "";
    showUsers();
    closeForm();
    localStorage.setItem('users', JSON.stringify(users));
  });
}

function deleteUserHandler(id) {
  closeForm();
  closeUserView();
  const modal = createElement("div", `Confirm`, { className: "modal" }, null, "body");
  const modalButtons = createElement(
    "div",
    "",
    { className: "buttonWrap" },
    { click: { callback: confirmDelete, isOnCapture: true } },
    modal
  );
  createElement("input", "", { type: "button", value: "Yes" }, null, modalButtons);
  createElement("input", "", { type: "button", value: "No" }, null, modalButtons);

  function confirmDelete(event) {
    const buttonValue = event.target.getAttribute("value");
    if (buttonValue === "Yes") {
      const index = users.findIndex((user) => user.id == id);
      users.splice(index, 1);
      removeElement(`div[data-row-id="${id}"`);
      const localUsers = JSON.parse(localStorage.getItem('users'));
      localUsers.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(localUsers));
      modal.classList.remove("modal");
      modal.classList.add("hidden");
    } else if (buttonValue === "No") {
      modal.classList.remove("modal");
      modal.classList.add("hidden");
    }
  }
}

function handleUserButtonsClick(event) {
  const action = event.target.getAttribute("name");
  const id = event.target.getAttribute("data-id");
  const user = users.find((user) => user.id == id);

  if (action === "view") {
    viewUserHandler(user);
  } else if (action === "edit") {
    editUserHandler(user);
  } else if (action === "delete") {
    deleteUserHandler(user.id);
  }
}

function showUserButtons(user, parentElement) {
  const buttonsHandlers = {
    click: {
      callback: handleUserButtonsClick,
      isOnCapture: true,
    },
  };
  const actionsButtonsDiv = createElement("div", "", { className: "buttonWrap" }, buttonsHandlers, parentElement);
  createElement(
    "input",
    "",
    {
      value: "View",
      type: "button",
      name: "view",
      "data-id": user.id,
    },
    null,
    actionsButtonsDiv
  );
  createElement(
    "input",
    "",
    { value: "Edit", type: "button", name: "edit", "data-id": user.id },
    null,
    actionsButtonsDiv
  );
  createElement(
    "input",
    "",
    { value: "Delete", type: "button", name: "delete", "data-id": user.id },
    null,
    actionsButtonsDiv
  );
}

function showUsersList() {
  users.forEach(function (user) {
    const parentDiv = createElement("div", "", { "data-row-id": user.id }, null, "#usersList");
    const fullname = `${user.name} ${user.lastName}`;
    createElement("div", fullname, null, null, parentDiv);
    showUserButtons(user, parentDiv);
  });
}

function showUsers() {
  showUsersListHeader();
  showUsersList();
}

window.addEventListener("load", function () {
  showUsers();
  addNewUser();
  saveUser();
  localStorage.setItem('users', JSON.stringify(users));
});


