import { supabase } from "./supabaseClient.js";

const newsGrid = document.getElementById("news-grid");
const newsEmpty = document.getElementById("news-empty");

async function loadNews() {
  if (!newsGrid) return;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false })
    .limit(9);

  if (error) {
    console.error("Error loading news:", error.message);
    newsEmpty.querySelector("p").textContent = "Unable to load news. Please try again later.";
    newsEmpty.classList.remove("hidden");
    return;
  }

  if (!data || data.length === 0) {
    newsEmpty.classList.remove("hidden");
    return;
  }

  newsGrid.innerHTML = "";

  data.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "card animate-on-scroll";
    if (i > 0) card.classList.add(`delay-${Math.min(i, 4)}`);

    const d = item.date ? new Date(item.date) : null;
    const dateStr = d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    card.innerHTML = `
      <div class="card-image">
        <img src="${item.image_url || "https://images.pexels.com/photos/3182766/pexels-photo-3182766.jpeg?auto=compress&cs=tinysrgb&w=800"}" alt="${item.title || "MNSSA news"}" loading="lazy">
      </div>
      <div class="card-header">
        <h3 class="card-title">${item.title || "Untitled"}</h3>
        <span class="card-meta">${dateStr}</span>
      </div>
      <div class="card-body">
        <p>${item.short_description || ""}</p>
      </div>
    `;

    newsGrid.appendChild(card);
  });
  if (typeof initScrollAnimations === "function") initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

