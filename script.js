const API_KEY = "80f26fce4fd25365b252ede3143937e1";

// ✅ FIXED REAL IMAGE LINKS (NO RANDOMNESS)
const clothing = {
  tops: {
    "T-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    "Shirt": "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=400&q=80",
    "Hoodie": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
    "Tank": "https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=400&q=80",
    "Jacket": "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=400&q=80"
  },

  bottoms: {
    "Jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80",
    "Shorts": "https://images.unsplash.com/photo-1593032465171-8f0e4c1c3c2e?auto=format&fit=crop&w=400&q=80"
  }
};

// 🌦 weather
function getWeather() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      const data = await res.json();

      if (data.cod !== 200) reject(data.message);
      else resolve(data);

    }, () => reject("Location denied"));
  });
}

// ❤️ save
function saveOutfit(name, topImg, bottomImg) {
  let saved = JSON.parse(localStorage.getItem("saved")) || [];
  saved.push({ name, topImg, bottomImg });
  localStorage.setItem("saved", JSON.stringify(saved));
  displaySaved();
}

// show saved
function displaySaved() {
  let saved = JSON.parse(localStorage.getItem("saved")) || [];
  let list = document.getElementById("savedList");
  list.innerHTML = "";

  saved.forEach(o => {
    list.innerHTML += `
      <div class="outfit">
        <div class="img-row">
          <div class="img-box"><img src="${o.topImg}"></div>
          <div class="img-box"><img src="${o.bottomImg}"></div>
        </div>
        <p>${o.name}</p>
      </div>
    `;
  });
}

// generate
async function generateOutfit() {
  const result = document.getElementById("result");
  result.innerHTML = "⏳ Loading...";

  try {
    const data = await getWeather();

    const temp = data.main.temp;
    const city = data.name;

    let tops, bottoms;

    if (temp > 30) {
      tops = ["T-shirt", "Tank"];
      bottoms = ["Shorts"];
    } else if (temp > 20) {
      tops = ["T-shirt", "Shirt"];
      bottoms = ["Jeans", "Shorts"];
    } else {
      tops = ["Hoodie", "Jacket"];
      bottoms = ["Jeans"];
    }

    let html = `<div class="weather">📍 ${city} • ${Math.round(temp)}°C</div>`;

    for (let i = 0; i < 3; i++) {
      let top = tops[Math.floor(Math.random() * tops.length)];
      let bottom = bottoms[Math.floor(Math.random() * bottoms.length)];

      let topImg = clothing.tops[top];
      let bottomImg = clothing.bottoms[bottom];

      let name = `${top} + ${bottom}`;

      html += `
        <div class="outfit">
          <div class="img-row">
            <div class="img-box"><img src="${topImg}"></div>
            <div class="img-box"><img src="${bottomImg}"></div>
          </div>

          <p><b>Top:</b> ${top}</p>
          <p><b>Bottom:</b> ${bottom}</p>

          <button onclick="saveOutfit('${name}','${topImg}','${bottomImg}')">
            ❤️ Save
          </button>
        </div>
      `;
    }

    result.innerHTML = html;

  } catch (err) {
    result.innerHTML = `❌ ${err}`;
  }
}

window.onload = displaySaved;