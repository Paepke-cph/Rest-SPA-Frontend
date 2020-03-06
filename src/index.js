/* eslint-disable no-undef */
import "bootstrap/dist/css/bootstrap.css";

const BASE_API = "http://localhost:3333/api/users";

const fetchUsers = (api, callback) => {
  fetch(api)
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          message: response.json()
        });
      }
      return response.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(() => {
      updateTable([]);
    });
};

const createUser = (api, data) => {
  fetch(api, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          message: response.json()
        });
      }
      return response.json();
    })
    .then(() => {
      $("#createUserModal").modal("hide");
      fetchUsers(BASE_API, updateTable);
    })
    .catch(err => console.log(err));
};

const deleteUser = (api, id) => {
  fetch(api + "/" + id, {
    method: "DELETE"
  })
    .then(response => {
      return response.json();
    })
    .then(() => {
      fetchUsers(BASE_API, updateTable);
    });
};

const updateUser = (api, data) => {
  var apiURL = api + "/" + data.id;
  fetch(apiURL, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .then(() => {});
};

const getSelectedRows = () => {
  var rows = Array.from(
    document.getElementById("tbody").getElementsByTagName("input")
  );
  return rows.filter(element => {
    return element.checked === true;
  });
};

const getSelectedUserIds = () => {
  let validRows = getSelectedRows();
  return validRows.map(element => {
    return element.value;
  });
};

const userToRow = user => {
  return `<tr id="${user.id}">
  <td>${user.id}</td>
  <td>${user.name}</td>
  <td>${user.age}</td>
  <td>${user.gender}</td>
  <td>${user.email}</td>
  <td>
    <input type="checkbox" value='${user.id}'>
  </td></tr>`;
};

const updateTable = data => {
  var output;
  if (Array.isArray(data)) {
    var tableData = data.map(user => {
      return userToRow(user);
    });
    output = tableData.join("");
  } else {
    output = userToRow(data);
  }
  document.getElementById("tbody").innerHTML = output;
};

// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", () => {
  fetchUsers(BASE_API, updateTable);
});

document.getElementById("idInputField").addEventListener("input", () => {
  let id = document.getElementById("idInputField").value;
  let apiURL = BASE_API + "/" + id;
  fetchUsers(apiURL, updateTable);
});

document.getElementById("createUserButton").addEventListener("click", () => {
  let _name = document.getElementById("createUserName").value;
  let _age = Number(document.getElementById("createUserAge").value);
  let _gender = document.getElementById("createUserGender").value.toLowerCase();
  let _mail = document.getElementById("createUserMail").value;
  const user = {
    name: _name,
    age: _age,
    gender: _gender,
    email: _mail
  };
  createUser(BASE_API, user);
});

document.getElementById("deleteUsersButton").addEventListener("click", () => {
  let toDeleteUsers = getSelectedUserIds();
  toDeleteUsers.forEach(user => deleteUser(BASE_API, user));
  fetchUsers(BASE_API, updateTable);
});

let toEditRows = [];

function editLoop() {
  var row = toEditRows.pop();
  var rowData = Array.from(
    row["parentElement"]["parentElement"].getElementsByTagName("td")
  );
  var genderText = rowData[3].innerText;
  var option = getSelectedOption(genderText);
  document.getElementById("editUserId").value = rowData[0].innerText;
  document.getElementById("editUserName").value = rowData[1].innerText;
  document.getElementById("editUserAge").value = rowData[2].innerText;
  document.getElementById("editUserGender").value = option;
  document.getElementById("editUserMail").value = rowData[4].innerText;

  document.getElementById("editUserNameplate").innerText =
    "Edit '" + rowData[1].innerText + "'";
  $("#editUsersModal").modal("show");
}

const getSelectedOption = textOption => {
  var options = Array.from(document.getElementById("editUserGender").options);
  var selected = "";
  options.forEach(option => {
    if (option.innerText.toUpperCase() === textOption.toUpperCase()) {
      selected = option;
    }
  });
  return selected.innerText;
};

document.getElementById("editUsersButton").addEventListener("click", () => {
  toEditRows = getSelectedRows();
  editLoop();
});

document
  .getElementById("submitEditUserButton")
  .addEventListener("click", () => {
    var user = {
      id: Number(document.getElementById("editUserId").value),
      name: document.getElementById("editUserName").value,
      age: Number(document.getElementById("editUserAge").value),
      gender: document.getElementById("editUserGender").value.toLowerCase(),
      email: document.getElementById("editUserMail").value
    };
    updateUser(BASE_API, user);
    $("#editUsersModal").modal("hide");
    if (toEditRows.length > 0) {
      setTimeout(editLoop, 500);
    } else {
      fetchUsers(BASE_API, updateTable);
    }
  });
