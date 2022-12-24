//  Server endpoint
const API_URL = "http://127.0.0.1:8000/extract-tables/";

// input file element
const fileInput = document.getElementById("file-input");

// error label
const errorLbl = document.getElementById("file-input-error");

// tables container element
const tablesContainer = document.getElementById("tables-container");

// loader container
const loaderContainer = document.getElementById("loader-container");

// Listen to input changes
fileInput.addEventListener("input", () => {
  var file = fileInput.files[0];

  // init tables and errors display
  tablesContainer.innerHTML = "";
  errorLbl.innerHTML = "";
  fileInput.value = null;

  // ignore all files except PDF, JPG and PNG
  if (
    file.type != "application/pdf" &&
    file.type != "image/jpg" &&
    file.type != "image/png"
  ) {
    errorLbl.innerHTML = "File must be a PDF, JPG or PNG";
    return;
  }

  // display loader
  displayLoader();

  // Query From Recognizer and get data
  fetchTables();
});

function fetchTables(file) {
  var formdata = new FormData();
  formdata.append("file", file);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((result) => displayTables(result))
    .then(() => removeLoader())
    .catch(() => alert("Error fetching data"));
}

// display each table in the result
function displayTables(tables) {
  let tableIndex = 0;
  tables.forEach((table) => {
    createTable(table, tableIndex);
    tableIndex++;
  });
}

// create table element and add it to the DOM
function createTable(table, tableIndex) {
  let t = document.createElement("table");
  let tbody = document.createElement("tbody");

  // for each row, create a row element and add it to table body
  for (let i = 0; i < table.row_count; i++) {
    const row = table.cells.filter((cell) => cell.row_index == i);
    tbody.appendChild(createTableRow(row));
  }

  t.appendChild(tbody);
  t.id = "table-" + tableIndex;
  t.classList.add("table");

  // create export buttons and add them to the DOM
  tablesContainer.appendChild(createExportExcelButton(t.id));
  tablesContainer.appendChild(createCopyJsonButton(table));

  // add table to the DOM
  tablesContainer.appendChild(t);
}

function createTableRow(row) {
  let tr = document.createElement("tr");
  for (let cell of row) {
    tr.appendChild(createTableCell(cell, "td"));
  }
  return tr;
}

// create table cell element
function createTableCell(cell, type) {
  let element = document.createElement(type);
  element.setAttribute("colspan", cell.column_span);
  element.setAttribute("rowspan", cell.row_span);
  element.innerHTML = cell.content;
  return element;
}

// create export excel button and add event listener
function createExportExcelButton(tableId) {
  const btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn-outline-dark");
  btn.innerText = "Export as Excel";
  addExportAction(btn, tableId);
  return btn;
}

// create copy json button and add event listener
function createCopyJsonButton(table) {
  const btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn-dark");
  btn.innerText = "Copy JSON to clipboard";
  addCopyJsonToClipboardAction(btn, table);
  return btn;
}

// export excel using jquery table2excel
function addExportAction(btn, tableId) {
  btn.addEventListener("click", () => {
    $("#" + tableId).table2excel({
      exclude: ".excludeThisClass",
      name: "Worksheet Name",
      filename: "table.xls", // do include extension
      preserveColors: false, // set to true if you want background colors and font colors preserved
    });
  });
}

// copy table to clipboard
function addCopyJsonToClipboardAction(btn, table) {
  btn.addEventListener("click", () => {
    const text = JSON.stringify(table);
    navigator.clipboard.writeText(text).then(() => {
      alert("Table copied to clipboard");
    });
  });
}

//add loader elemnt to DOM
function displayLoader() {
  const span = document.createElement("span");
  span.classList.add("sr-only");

  const div = document.createElement("div");
  div.classList.add("spinner-grow");
  div.appendChild(span);

  loaderContainer.appendChild(div);
}

//remove loader from DOM
function removeLoader() {
  loaderContainer.innerHTML = "";
}
