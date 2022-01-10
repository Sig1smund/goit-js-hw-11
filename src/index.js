import FetchImages from "./fetchIt.js";
import LoadMoreBtn from "./load-more";
import "./css/styles.css";

const refs = {
  input: document.querySelector('[name="searchQuery"]'),
  searchForm: document.querySelector(".search-form"),
  gallery: document.querySelector(".gallery"),
  loadMoreBtn: document.querySelector(".load-more"),
};
const fetchImages = new FetchImages();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);

async function onSearch(e) {
  try {
    fetchImages.searchName = e.currentTarget.elements.searchQuery.value.trim();
    await e.preventDefault();
    await loadMoreBtn.show();
    await fetchImages.resetPage();
    await clearSearchForm();

    if (fetchImages.searchName !== "") {
      await fetchImages.getImages(fetchImages.searchName).then((data) => {
        addGallery(data);
        fetchImages.showTotalHits(data.totalHits);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function addGallery(data) {
  try {
    const markup = await data.hits.map((item) => {
      return `<a href="${item.largeImageURL}" class="photo-card">
      <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          
          <b>Likes</br><span class='text'>${item.likes}</span></b>
        </p>
        <p class="info-item">
          
          <b>Views</br><span class='text'>${item.views}</span></b>
        </p>
        <p class="info-item">
          
          <b>Comments</br><span class='text'>${item.comments}</span></b>
        </p>
        <p class="info-item">
          
          <b>Downloads</br><span class='text'>${item.downloads}</span></b>
        </p>
      </div>
      </a>`;
    });
    const gallery = await refs.gallery.insertAdjacentHTML("beforeend", markup);
    return gallery;
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    await loadMoreBtn.enable();
    await fetchImages.getImages();
    await fetchImages
      .getImages(fetchImages.searchName, fetchImages.totalHits)
      .then((data) => {
        addGallery(data);
      });
    await loadMoreBtn.show();
  } catch (error) {
    console.log(error);
  }
}

function clearSearchForm() {
  refs.gallery.innerHTML = "";
}
