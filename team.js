import { supabase } from "./supabaseClient.js";

const params = new URLSearchParams(window.location.search);
const teamId = params.get("id");

const teamCodeEl = document.getElementById("team-code");
const teamNameEl = document.getElementById("team-name");
const teamDescriptionEl = document.getElementById("team-description");

const membersGrid = document.getElementById("members-grid");
const membersEmpty = document.getElementById("members-empty");

const eventsGrid = document.getElementById("events-grid");
const eventsEmpty = document.getElementById("events-empty");

const formsWrap = document.getElementById("forms-wrap");
const formsEmpty = document.getElementById("forms-empty");

if (!teamId) {
  teamNameEl.textContent = "Team not found";
  teamDescriptionEl.textContent =
    "Missing team identifier. Please access this page from the Teams list.";
}

async function loadTeam() {
  if (!teamId) return;

  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .maybeSingle();

  if (error) {
    console.error("Error loading team:", error.message);
    teamNameEl.textContent = "Unable to load team";
    teamDescriptionEl.textContent =
      "We couldn't fetch team details at the moment. Please try again.";
    return;
  }

  if (!data) return;

  if (teamCodeEl) teamCodeEl.textContent = data.code || data.name || "Team";
  if (teamNameEl) teamNameEl.textContent = data.name || "Team";
  if (teamDescriptionEl) teamDescriptionEl.textContent =
    data.description ||
    "This MNSSA team drives initiatives and projects across the network.";

  // Team-specific styling by ID: SCORP = green, SCORA = red (badge + all edges)
  const id = (data.id || "").toString().toLowerCase();
  document.body.classList.remove("team-scorp", "team-scora");
  if (id === "08414f44-2d0c-4459-b086-cbc58e1458e9") {
    document.body.classList.add("team-scorp");
  }
  if (id === "e05c2368-b636-4efb-a34a-55e9b5fea444") {
    document.body.classList.add("team-scora");
  }
  const code = (data.code || data.name || "").toLowerCase().trim();
  if (!document.body.classList.contains("team-scorp") && (code === "scorp" || code === "scorb" || code.startsWith("scorp") || code.startsWith("scorb"))) {
    document.body.classList.add("team-scorp");
  }
  if (!document.body.classList.contains("team-scora") && (code === "scora" || code.startsWith("scora"))) {
    document.body.classList.add("team-scora");
  }
}

async function loadMembers() {
  if (!teamId) return;

  const leadersGrid = document.getElementById("leaders-grid");
  const membersGrid = document.getElementById("members-grid");

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("team_id", teamId)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading members:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    if (membersEmpty) membersEmpty.classList.remove("hidden");
    return;
  }

  leadersGrid.innerHTML = "";
  membersGrid.innerHTML = "";

  data.forEach((member) => {
    const card = document.createElement("article");
    card.className = "card";

    const initials =
      member.name
        ?.split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?";

    card.innerHTML = `
      <div class="card-header">
        <div class="member-avatar">
          ${
            member.photo_url
              ? `<img src="${member.photo_url}" alt="${member.name}" />`
              : `<span>${initials}</span>`
          }
        </div>

        <div class="member-meta">
          <p class="member-name">${member.name}</p>
          <p class="member-role">${member.position || ""}</p>
        </div>
      </div>
    `;

    if (
      member.position === "LORP" ||
      member.position === "LORP GA"
    ) {
      leadersGrid.appendChild(card);
    } else {
      membersGrid.appendChild(card);
    }
  });
}

async function loadForms() {
  if (!teamId || !formsWrap) return;

  const { data: forms, error } = await supabase
    .from("forms")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading forms:", error.message);
    formsEmpty.classList.remove("hidden");
    formsEmpty.textContent = "Unable to load forms.";
    return;
  }

  if (!forms || forms.length === 0) {
    formsEmpty.classList.remove("hidden");
    return;
  }

  formsWrap.innerHTML = "";

  for (const form of forms) {
    const { data: fields, error: fieldsError } = await supabase
      .from("form_fields")
      .select("*")
      .eq("form_id", form.id)
      .order("order_index", { ascending: true });

    if (fieldsError) {
      console.error("Error loading form fields:", fieldsError.message);
      continue;
    }

    const card = document.createElement("section");
    card.className = "form-card";

    const formId = `form-${form.id}`;

    card.innerHTML = `
      <h3>${form.title || "Form"}</h3>
      <p>${form.description || ""}</p>
      <form id="${formId}" data-form-id="${form.id}">
        <div class="form-grid">
          ${fields
            .map((field) => {
              const requiredMark = field.is_required ? '<span class="required">*</span>' : "";
              const base = `
                <div class="form-field">
                  <label class="form-label" for="field-${field.id}">
                    ${field.label || field.name}
                    ${requiredMark}
                  </label>
                  {{input}}
                </div>
              `;

              const type = field.type;
              const name = `field_${field.id}`;
              const requiredAttr = field.is_required ? "required" : "";

              let inputHtml = "";
              const options = Array.isArray(field.options) ? field.options : [];

              if (type === "text" || type === "email") {
                inputHtml = `<input id="field-${field.id}" name="${name}" type="${type}" class="input" ${requiredAttr} />`;
              } else if (type === "textarea") {
                inputHtml = `<textarea id="field-${field.id}" name="${name}" class="textarea" ${requiredAttr}></textarea>`;
              } else if (type === "select") {
                inputHtml = `
                  <select id="field-${field.id}" name="${name}" class="select" ${requiredAttr}>
                    <option value="">Select an option</option>
                    ${options
                      .map((opt) => `<option value="${opt.value || opt}">${opt.label || opt}</option>`)
                      .join("")}
                  </select>
                `;
              } else if (type === "radio" || type === "checkbox") {
                inputHtml = `
                  <div class="options-stack">
                    ${options
                      .map(
                        (opt, index) => `
                          <label class="option-row">
                            <input
                              type="${type}"
                              name="${name}${type === "checkbox" ? "[]" : ""}"
                              value="${opt.value || opt}"
                            />
                            <span>${opt.label || opt}</span>
                          </label>
                        `
                      )
                      .join("")}
                  </div>
                `;
              } else {
                inputHtml = `<input id="field-${field.id}" name="${name}" type="text" class="input" ${requiredAttr} />`;
              }

              return base.replace("{{input}}", inputHtml);
            })
            .join("")}
        </div>
        <div class="form-footer">
          <p class="form-status" data-status></p>
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
    `;

    const formEl = card.querySelector("form");
    attachFormHandler(formEl, fields);

    formsWrap.appendChild(card);
  }
}
async function loadEvents() {
  if (!teamId || !eventsGrid) return;

  let events;
  let error;

  // Try ordering by "event_date" first; if that column doesn't exist, try "date"
  const res1 = await supabase
    .from("events")
    .select("*")
    .eq("team_id", teamId)
    .order("event_date", { ascending: false });
  error = res1.error;
  events = res1.data;

  if (error && error.message && /event_date|column/i.test(error.message)) {
    const res2 = await supabase
      .from("events")
      .select("*")
      .eq("team_id", teamId)
      .order("date", { ascending: false });
    error = res2.error;
    events = res2.data;
  }

  if (error) {
    console.error("Error loading events:", error.message);
    if (eventsEmpty) {
      const p = eventsEmpty.querySelector("p");
      if (p) p.textContent = "Unable to load events. " + (error.message || "");
      eventsEmpty.classList.remove("hidden");
    }
    return;
  }

  if (!events || events.length === 0) {
    if (eventsEmpty) eventsEmpty.classList.remove("hidden");
    return;
  }

  eventsGrid.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("article");
    card.className = "card";

    const eventDate = event.date || event.event_date;
    const dateStr = eventDate ? new Date(eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    card.innerHTML = `
      <div class="card-image">
        <img src="${event.image_url || "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=800"}" alt="${event.title || "Event"}" loading="lazy">
      </div>
      <div class="card-header">
        <h3 class="card-title">${event.title || "Event"}</h3>
        <span class="card-meta">${dateStr}</span>
      </div>
      <div class="card-body">
        <p>${event.description || ""}</p>
      </div>
    `;

    eventsGrid.appendChild(card);
  });
}
async function saveFormResponse(formId, fields, formEl) {
  const statusEl = formEl.querySelector("[data-status]");
  const submitBtn = formEl.querySelector('button[type="submit"]');

  const formData = new FormData(formEl);

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";
  statusEl.textContent = "";

  const { data: response, error: responseError } = await supabase
    .from("form_responses")
    .insert({ form_id: formId, team_id: teamId })
    .select("*")
    .maybeSingle();

  if (responseError || !response) {
    console.error("Error saving form response:", responseError?.message);
    statusEl.textContent = "Something went wrong. Please try again.";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    return;
  }

  const answers = [];

  fields.forEach((field) => {
    const name = `field_${field.id}`;
    let value = null;

    if (field.type === "checkbox") {
      const values = formData.getAll(`${name}[]`);
      value = values;
    } else if (field.type === "radio") {
      value = formData.get(name);
    } else {
      value = formData.get(name);
    }

    if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
      return;
    }

    answers.push({
      response_id: response.id,
      form_id: formId,
      field_id: field.id,
      value: Array.isArray(value) ? JSON.stringify(value) : value,
    });
  });

  if (answers.length) {
    const { error: answersError } = await supabase.from("form_answers").insert(answers);
    if (answersError) {
      console.error("Error saving answers:", answersError.message);
      statusEl.textContent = "Saved response, but failed to store some answers.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      return;
    }
  }

  formEl.reset();
  statusEl.textContent = "Thank you! Your response has been recorded.";
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";
}

function attachFormHandler(formEl, fields) {
  if (!formEl) return;

  const formId = formEl.dataset.formId;
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormResponse(formId, fields, formEl);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTeam();
  loadMembers();
  loadEvents();
  loadForms();
});

