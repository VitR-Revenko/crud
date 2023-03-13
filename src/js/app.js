// let nameFormData = document.form.name.value;
// let passwordFormData = document.form.password.value;
// let emailFormData = document.form.email.value;
// let ageFormData = document.form.age.value;
// let telFormData = document.form.tel.value;
// let cardFormData = document.form.card.value;

function saveUsersToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

function addNewUser() {
  document.getElementById("addBtn").addEventListener("click", () => {
    closeForm();
    closeUserView();
    document.getElementById("addForm").classList.remove("hidden");
    createElement(
      "input",
      "",
      { id: "saveBtn", type: "button", value: "Save" },
      { click: { callback: saveUser } },
      ".form"
    );
  });
}

function closeUserView() {
  clearContent("#userView");
}

function closeForm() {
  document.getElementById("addForm").classList.add("hidden");
  document.form.name.value = "";
  document.form.password.value = "";
  document.form.email.value = "";
  document.form.age.value = "";
  document.form.tel.value = "";
  document.form.card.value = "";
  if (document.getElementById("saveBtn")) {
    removeElement("#saveBtn");
  } else if (document.getElementById("editBtn")) {
    removeElement("#editBtn");
  }
}

function saveValidate() {
  if (!nameRegExp.test(document.form.name.value) || 
      !passwordRegExp.test(document.form.password.value) || 
      !emailRegExp.test(document.form.email.value) || 
      !ageRegExp.test(document.form.age.value) || 
      !telRegExp.test(document.form.tel.value) || 
      !cardRegExp.test(document.form.card.value)) {
    createElement(
      "div",
      "Error!!! Click here!!!",
      { className: "error" },
      { click: { callback: returnToForm } },
      "body"
    );
    function returnToForm() {
      removeElement(".error");
      document.getElementById("addForm").classList.remove("hidden");
      createElement(
        "input",
        "",
        { id: "saveBtn", type: "button", value: "Save" },
        { click: { callback: saveUser } },
        ".form"
      );
    }
  } else {
    pushUser();
  }
}

function pushUser() {
  const userForPush = {
    id: Date.now(),
    name: document.form.name.value,
    password: document.form.password.value,
    email: document.form.email.value,
    age: document.form.age.value,
    tel: document.form.tel.value,
    card: document.form.card.value,
  };
  
  users.push(userForPush);
  saveUsersToLocalStorage();
}

function saveUser() {
  saveValidate();
  clearContent("#usersList");
  showUsers();
  closeForm();
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
  createElement("div", `Password: ${user.password}`, null, null, parentSelector);
  createElement("div", `Email: ${user.email}`, null, null, parentSelector);
  createElement("div", `Age: ${user.age}`, null, null, parentSelector);
  createElement("div", `Phone number: ${user.tel}`, null, null, parentSelector);
  createElement("div", `Credit card: ${user.card}`, null, null, parentSelector);
}

function editUserHandler(user) {
  const currentUser = user;
  closeForm();
  closeUserView();
  function editUser() {
    if (!nameRegExp.test(document.form.name.value) || 
    !passwordRegExp.test(document.form.password.value) || 
    !emailRegExp.test(document.form.email.value) || 
    !ageRegExp.test(document.form.age.value) || 
    !telRegExp.test(document.form.tel.value) || 
    !cardRegExp.test(document.form.card.value)) {
      createElement(
        "div",
        "Error!!! Click here!!!",
        { className: "error" },
        { click: { callback: returnToForm } },
        "body"
      );
      function returnToForm() {
        removeElement(".error");
        document.getElementById("addForm").classList.remove("hidden");
        createElement(
          "input",
          "",
          { id: "editBtn", type: "button", value: "Edit" },
          { click: { callback: editUser } },
          ".form"
        );
      }
    } else {
      currentUser.name = document.form.name.value;
      currentUser.password = document.form.password.value;
      currentUser.email = document.form.email.value;
      currentUser.age = document.form.age.value;
      currentUser.tel = document.form.tel.value;
      currentUser.card = document.form.card.value;
      saveUsersToLocalStorage();
    }
    clearContent("#usersList");
    showUsers();
    closeForm();
  }
  document.getElementById("addForm").classList.remove("hidden");
  createElement(
    "input",
    "",
    { id: "editBtn", type: "button", value: "Edit" },
    { click: { callback: editUser } },
    ".form"
  );
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
      const index = users.findIndex((user) => user.id === parseInt(id));
      users.splice(index, 1);
      removeElement(`div[data-row-id="${id}"`);
      const localUsers = JSON.parse(localStorage.getItem("users"));
      localUsers.splice(index, 1);
      saveUsersToLocalStorage();
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
  const user = users.find((user) => user.id === parseInt(id));

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
    const name = `${user.name}`;
    createElement("div", name, null, null, parentDiv);
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
  saveUsersToLocalStorage();
});
