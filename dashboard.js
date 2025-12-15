/* ===========================
   CONFIG
=========================== */
const API_BASE_URL = "https://remarks-backend.onrender.com";

/* ===========================
   LOADER HELPERS
=========================== */
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}

/* ===========================
   READ SHEET NAME
=========================== */
const params = new URLSearchParams(window.location.search);
const sheet = params.get("sheet");

if (!sheet) {
  document.body.innerHTML = "<p>Sheet name missing</p>";
  throw new Error("Sheet param missing");
}

document.getElementById("title").innerText = sheet + " Dashboard";

/* ===========================
   FETCH DATA
=========================== */
showLoader();

fetch(`${API_BASE_URL}/api?action=getRows&sheet=${encodeURIComponent(sheet)}`)
  .then(res => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  })
  .then(json => {
    if (!json.data || json.data.length === 0) {
      document.getElementById("dataTable").innerHTML =
        "<tr><td>No data found</td></tr>";
      hideLoader();
      return;
    }

    if (json.data[0]["Timestamp"]) {
      json.data.sort(
        (a, b) => new Date(b["Timestamp"]) - new Date(a["Timestamp"])
      );
    }

    renderTable(json.data);
    hideLoader();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("dataTable").innerHTML =
      "<tr><td>Failed to load data</td></tr>";
    hideLoader();
  });

/* ===========================
   RENDER TABLE (NO STATUS)
=========================== */
function renderTable(rows) {
  const table = document.getElementById("dataTable");
  table.innerHTML = "";

  // 🔥 Headers exactly as sheet
  const headers = Object.keys(rows[0]);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  headers.forEach(h => {
    const th = document.createElement("th");
    th.innerText = h;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  rows.forEach(r => {
    const tr = document.createElement("tr");

    headers.forEach(h => {
      const td = document.createElement("td");
      td.innerText = r[h] ?? "";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}

/* ===========================
   OPEN GOOGLE FORM
=========================== */
function openRemarksForm() {
  const formUrl =
    "https://docs.google.com/forms/d/1ErfMkIOyJvUCMrS1t5zRm1RYADoFlWPgj9XvhlK9nuY/viewform" +
    `?entry.111=${encodeURIComponent(sheet)}`;

  window.open(formUrl, "_blank");
}
