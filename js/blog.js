<script>

const listDiv = document.getElementById("blog-list");
const loadBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".category-btn");
const featuredContainer = document.getElementById('featured-container');

let currentCategory = "All";
let searchQuery = "";
let visibleCount = 10;

// Update 1: Pulls the image from the array for the Featured post
function renderFeatured() {
  const latestBlog = myBlogs[myBlogs.length - 1];
  featuredContainer.innerHTML = `
    <img src="${latestBlog.image || 'images/default-blog.webp'}" onerror="this.src='blog-placeholder.png'" class="w-full h-full object-cover transition duration-500 hover:scale-105">
    <div class="p-8">
      <span class="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">${latestBlog.category}</span>
      <h2 class="text-3xl font-bold text-white mt-5">${latestBlog.title}</h2>
      <p class="text-slate-400 mt-4">${latestBlog.desc}</p>
      <a href="${latestBlog.link}" class="inline-block mt-6 bg-blue-600 px-6 py-3 rounded-xl font-bold text-white">Read Article →</a>
    </div>
  `;
}

// Update 2: Pulls the image from the array for all normal posts
function renderBlogs() {
  const filtered = myBlogs.filter(blog => {
    const matchesCategory = (currentCategory === "All" || blog.category === currentCategory);
    const matchesSearch = (
      blog.title.toLowerCase().includes(searchQuery) || 
      blog.desc.toLowerCase().includes(searchQuery) ||
      (blog.category && blog.category.toLowerCase().includes(searchQuery))
    );
    return matchesCategory && matchesSearch;
  });

  listDiv.innerHTML = "";
  if (filtered.length === 0) {
    listDiv.innerHTML = `<p class="text-slate-400 text-center w-full col-span-1 md:col-span-2 py-10">No articles found matching your criteria.</p>`;
    loadBtn.style.display = "none";
    return;
  }

  const blogsToRender = filtered.slice(0, visibleCount);
  blogsToRender.forEach(blog => {
    listDiv.innerHTML += `
      <article class="blog-card flex flex-col overflow-hidden">
        <img src="${blog.image || 'images/default-blog.webp'}" onerror="this.src='blog-placeholder.png'" class="w-full h-48 object-cover transition duration-500 hover:scale-105">  
        <div class="p-5 flex flex-col flex-1">
          <div class="flex justify-between items-center mb-3">
            <span class="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-1 rounded">${blog.category}</span>
            <span class="text-xs text-slate-500">${blog.readTime || "5 min read"}</span>
          </div>
          <h3 class="blog-title">${blog.title}</h3>
          <p class="blog-desc">${blog.desc}</p>
          <div class="flex justify-between text-xs text-slate-500 mt-3 mb-5">
            <span>📅 ${blog.date || "June 2026"}</span>
            <span>🕒 ${blog.readTime || "5 min read"}</span>
          </div>
          <a href="${blog.link}" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold text-white transition mt-auto">Read Article →</a>     
        </div>
      </article>
    `;
  });
  loadBtn.style.display = (visibleCount >= filtered.length) ? "none" : "block";
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  visibleCount = 10;
  renderBlogs();
});

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => { b.classList.remove("bg-blue-600", "text-white"); b.classList.add("bg-[#111827]"); });
    btn.classList.remove("bg-[#111827]");
    btn.classList.add("bg-blue-600", "text-white");
    currentCategory = btn.dataset.category;
    visibleCount = 10;
    renderBlogs();
  });
});

loadBtn.addEventListener("click", () => {
  visibleCount += 10;
  renderBlogs();
});

// Initialize Page
renderFeatured();
renderBlogs();

    
  </script>
