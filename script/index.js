const categoryContainer = document.getElementById("category-container");
const newsContainer = document.getElementById("news-container");
const bookmarkContainer = document.getElementById("bookmark-container");
const bookmarkCount = document.getElementById("bookmark-count");
const newsDetailsModal = document.getElementById("news_details_modal");
const modalContainer = document.getElementById("modal-container");

let bookmarks = [];

const loadingCategory = () => {
  url = "https://news-api-fs.vercel.app/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};

const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += `<li id="${cat.id}" class="hover:border-b hover:border-red-600 border-red-600 cursor-pointer">
            ${cat.title}`;
  });
  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");

    allLi.forEach((li) => {
      li.classList.remove("border-b-4");
    });
    if (e.target.localName === "li") {
      showLoading();
      e.target.classList.add("border-b-4");
      loadNewsCategory(e.target.id);
    }
  });
};

const showNewsByCategory = (articles) => {
  if (articles.length === 0) {
    showEmptyMessage();
    return;
  }

  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    newsContainer.innerHTML += `
    <div class="border border-gray-300 rounded-lg">
     <div class="">
        <img src="${article.image.srcset[5].url}" alt="" srcset="" />
      </div>
    <div id="${article.id}" class="p-2">
      <h1 class="font-extrabold">${article.title}</h1>
      <p class="text-sm">${article.time}</p>
      <button class="btn mt-2">Bookmark</button>
       <button class="btn mt-2">View Details</button>
    </div>
    </div>`;
  });
};

const loadNewsCategory = (categoryId) => {
  const url = `https://news-api-fs.vercel.app/api/categories/${categoryId}
  `;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showNewsByCategory(data.articles);
    })
    .catch((err) => {
      showError();
    });
};

newsContainer.addEventListener("click", (e) => {
  if (e.target.innerText === "Bookmark") {
    handleBookmarks(e);
  }
  if (e.target.innerText === "View Details") {
    handleViewDetails(e);
  }
});

const handleBookmarks = (e) => {
  const title = e.target.parentNode.children[0].innerText;
  const id = e.target.parentNode.id;

  bookmarks.push({
    title: title,
    id: id,
  });
  showBookmarks(bookmarks);
};

const showBookmarks = (bookmarks) => {
  bookmarkContainer.innerHTML = "";
  bookmarks.forEach((bookmark) => {
    bookmarkContainer.innerHTML += `
   <div class="border border-gray-300 p-2 my-2 rounded-lg">
      <h1>${bookmark.title}</h1>
      <button onclick="handleDeleteBookmark('${bookmark.id}')" class="btn btn-xs">Delete</button>
      
   </div>
   `;
  });
  bookmarkCount.innerText = bookmarks.length;
};

const handleDeleteBookmark = (bookmarkId) => {
  const filteredBookmarks = bookmarks.filter(
    (bookmark) => bookmark.id !== bookmarkId,
  );
  bookmarks = filteredBookmarks;
  showBookmarks(bookmarks);
};

const handleViewDetails = (e) => {
  const id = e.target.parentNode.id;
  const url = `https://news-api-fs.vercel.app/api/news/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showDetailsNews(data.article);
    })
    .catch((err) => {
      console.log(err);
    });
};

const showDetailsNews = (article) => {
  newsDetailsModal.showModal();
  modalContainer.innerHTML = `
      <p class="text-sm font-semibold">${article.timestamp}</p>

      <h1 class="font-bold text-2xl">${article.title}</h1>
      <img class="my-4 rounded-lg" src="${article.images[0].url}" alt=""></img>
  <p>${article.content.join("")}</p>
  `;
};

const showLoading = () => {
  newsContainer.innerHTML = `<div class="col-span-full flex justify-center items-center">
          <span
            class="loading loading-spinner text-error items-center min-h-[400px]"
          ></span>
        </div>`;
};

const showError = () => {
  newsContainer.innerHTML = `<div class="bg-red-500 p-3 col-span-full  flex justify-center items-center  min-h-[200px] rounded-lg"> <span class="text-white font-semibold text-4xl">Something went wrong</span></div>`;
};

const showEmptyMessage = () => {
  newsContainer.innerHTML = `<div class="bg-red-500 p-3 col-span-full  flex justify-center items-center  min-h-[200px] rounded-lg"> <span class="text-white font-semibold text-4xl">No news found for this category</span></div>`;
};

loadingCategory();
loadNewsCategory("main");
