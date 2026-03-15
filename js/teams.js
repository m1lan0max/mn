import { supabase } from "./supabaseClient.js";

const teamsGrid = document.getElementById("teams-grid");
const teamsEmpty = document.getElementById("teams-empty");

async function loadTeams() {
  if (!teamsGrid) return;

  const { data: teams, error } = await supabase
    .from("teams")
    .select("id, name, description, logo_url")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading teams:", error);

    if (teamsEmpty) {
      teamsEmpty.classList.remove("hidden");
      teamsEmpty.textContent = "Unable to load teams.";
    }

    return;
  }

  if (!teams || teams.length === 0) {
    if (teamsEmpty) teamsEmpty.classList.remove("hidden");
    return;
  }

  teamsGrid.innerHTML = "";

  teams.forEach((team, i) => {
    const card = document.createElement("article");
    card.className = "glass-card animate-on-scroll";
    if (i > 0) card.classList.add(`delay-${Math.min(i, 3)}`);
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="card-body" style="text-align:center;">
        ${team.code ? `<p class="badge" style="margin-bottom:0.5rem;">${team.code}</p>` : ""}
        ${team.logo_url ? `<img src="${team.logo_url}" class="team-logo" alt="${team.name}">` : ""}
        <h3 class="card-title" style="margin-bottom:0.5rem;">${team.name}</h3>
        <p style="margin:0;font-size:0.9rem;color:rgba(255,255,255,0.6);line-height:1.5;">${team.description || ""}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `team.html?id=${team.id}`;
    });

    teamsGrid.appendChild(card);
  });
  if (typeof initScrollAnimations === "function") initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", loadTeams);
