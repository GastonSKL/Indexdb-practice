//PRACTICA CON INDEXED DB//

const IDBRequest = indexedDB.open("Base de datos", 1);

IDBRequest.addEventListener("upgradeneeded", () => {
  let db = IDBRequest.result;
  db.createObjectStore("nombres", {
    autoIncrement: true,
  });
  console.log("Base de datos creada correctamente");
});

IDBRequest.addEventListener("success", () => {
  leer();
});

IDBRequest.addEventListener("error", () => {
  console.log("Error al cargar la base de datos");
});

document.getElementById("add").addEventListener("click", () => {
  let nombre = document.getElementById("nombre").value;
  if (nombre.length > 0) {
    añadir({ nombre });
    leer();
    nombre = "";
  }
});

const añadir = (objeto) => {
  let db = IDBRequest.result;
  let IDBTransaction = db.transaction("nombres", "readwrite");
  let almacen = IDBTransaction.objectStore("nombres");
  almacen.add(objeto);
  console.log("Objeto añadido con exito");
};

const modificar = (key, objeto) => {
  let db = IDBRequest.result;
  let IDBTransaction = db.transaction("nombres", "readwrite");
  let almacen = IDBTransaction.objectStore("nombres");
  almacen.put(objeto, key);
  console.log("Objeto modificado con exito");
};

const eliminar = (key) => {
  let db = IDBRequest.result;
  let IDBTransaction = db.transaction("nombres", "readwrite");
  let almacen = IDBTransaction.objectStore("nombres");
  almacen.delete(key);
  console.log("Objeto eliminado con exito");
};

const leer = () => {
  let db = IDBRequest.result;
  let IDBTransaction = db.transaction("nombres", "readonly");
  let almacen = IDBTransaction.objectStore("nombres");
  const cursor = almacen.openCursor();
  const fragmento = document.createDocumentFragment();
  document.querySelector(".nombres").innerHTML = "";
  cursor.addEventListener("success", () => {
    if (cursor.result) {
      let elemento = nombresHTML(cursor.result.key, cursor.result.value);
      fragmento.appendChild(elemento);
      cursor.result.continue();
    } else {
      document.querySelector(".nombres").appendChild(fragmento);
    }
  });
};

const nombresHTML = (id, name) => {
  const container = document.createElement("DIV");
  const h2 = document.createElement("h2");
  const options = document.createElement("DIV");
  const saveButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  h2.textContent = name.nombre;
  h2.setAttribute("contenteditable", "true");
  h2.setAttribute("spellcheck", "false");
  saveButton.textContent = "Guardar";
  deleteButton.textContent = "Eliminar";

  container.classList.add("nombre");
  options.classList.add("options");
  saveButton.classList.add("imposible");
  deleteButton.classList.add("delete");

  options.appendChild(saveButton);
  options.appendChild(deleteButton);
  container.appendChild(h2);
  container.appendChild(options);

  h2.addEventListener("keyup", () => {
    saveButton.classList.replace("imposible", "posible");
  });

  saveButton.addEventListener("click", () => {
    if (saveButton.className == "posible") {
      modificar(id, { nombre: `${h2.textContent}` });
      saveButton.classList.replace("posible", "imposible");
    }
  });

  deleteButton.addEventListener("click", () => {
    eliminar(id);
    leer();
  });

  return container;
};



