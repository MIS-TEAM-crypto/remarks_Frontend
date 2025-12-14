/* ===========================
   CONFIG
=========================== */
const API_BASE_URL = "https://remarks-backend.onrender.com";

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
fetch(
  `${API_BASE_URL}/api?action=getRows&sheet=${encodeURIComponent(sheet)}`
)
  .then(res => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  })
  .then(json => {
    if (!json.data || json.data.length === 0) {
      document.getElementById("dataTable").innerHTML =
        "<tr><td>No data found</td></tr>";
      return;
    }

    // ✅ SORT: LATEST TIMESTAMP FIRST
    json.data.sort((a, b) => {
      return new Date(b["Timestamp"]) - new Date(a["Timestamp"]);
    });

    renderTable(json.data);
  })
  .catch(err => {
    console.error(err);
    document.getElementById("dataTable").innerHTML =
      "<tr><td>Failed to load data</td></tr>";
  });

/* ===========================
   RENDER TABLE (FIXED ORDER)
=========================== */
function renderTable(rows) {
  const table = document.getElementById("dataTable");

  // ✅ EXACT COLUMN ORDER AS REQUESTED
  const columnOrder = [
    "Timestamp",
    "Site",
    "Unique id",
    "I.N",
    "Item No",
    "Item Description",
    "UOM",
    "Total QTY",
    "Submitted By",
    "SECTION",
    "SEND FOR GET QUTATION",
    "Doer Name",
    "Doer Status",
    "Technical Approvals from the Indenter",
    "Approver Name",
    "Make Commercial Negotiation & Finalise Terms",
    "Get Approval",
    "Approver Name",
    "Generate all PO and Fill PO Google Form",
    "Doer Name",
    "PO Number",
    "Vendor Name",
    "Lead Days",
    "Payment Condition",
    "GRN to Store",
    "Local Purchase"
  ];

  let html =
    "<tr>" +
    columnOrder.map(col => `<th>${col}</th>`).join("") +
    "<th>Remarks</th></tr>";

  rows.forEach(r => {
    const remarksSubmitted =
      r["Remarks-1"] ||
      r["Remarks-2"] ||
      r["Remarks-3"] ||
      r["Remarks-4"];

    html +=
      "<tr>" +
      columnOrder.map(col => `<td>${r[col] ?? ""}</td>`).join("") +
      `<td>${
        remarksSubmitted
          ? `<span class="status-done">Remarks Submitted</span>`
          : `<button onclick="openForm('${sheet}','${r["Unique id"]}')">Remarks</button>`
      }</td></tr>`;
  });

  table.innerHTML = html;
}

/* ===========================
   OPEN GOOGLE FORM
=========================== */
function openForm(sheet, uid) {
  const formUrl =
    "https://docs.google.com/forms/d/1ErfMkIOyJvUCMrS1t5zRm1RYADoFlWPgj9XvhlK9nuY/viewform" +
    `?entry.111=${encodeURIComponent(sheet)}&entry.222=${encodeURIComponent(uid)}`;

  window.open(formUrl, "_blank");
}
