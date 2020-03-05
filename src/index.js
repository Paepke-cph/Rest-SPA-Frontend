import "bootstrap/dist/css/bootstrap.css";

const BASE_API = "http://localhost:3333/api/users";

const fetchUsers = (api, callback) => {
  fetch(api)
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data);
    });
};

const createUser = (api, data) => {
  fetch(api, {
    method: "POST",
    body: {
      name: data.name,
      age: data.age,
      gender: data.gener,
      email: data.mail
    }
  })
    .then(response => {
      return response.json();
    })
    .then(data => console.log(data));
};

const userToRow = user => {
  return `<tr> <td>${user.id}</td> <td>${user.name}</td> <td>${user.age}</td> <td>${user.gender}</td> <td>${user.email}</td> </tr>`;
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
  let _age = document.getElementById("createUserAge").value;
  let _gender = document.getElementById("createUserGender").value;
  let _mail = document.getElementById("createUserMail").value;
  const user = {
    name: _name,
    age: _age,
    gener: _gender,
    mail: _mail
  };
  createUser(BASE_API, user);
});
