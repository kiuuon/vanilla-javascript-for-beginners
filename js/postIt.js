const writeButton = document.querySelector(".write-button");
const writeModalOverlay = document.querySelector(".write-modal-overlay");
const cancelButton = document.querySelector(".cancel-button");
const writeForm = document.querySelector(".write-modal");
const title = document.querySelector(".title");
const date = document.querySelector(".date");
const color = document.querySelector(".color");
const content = document.querySelector(".content");
const postContainer = document.querySelector(".post-container");
const colorButtons = document.querySelectorAll(".color-button");

const current = new Date();
const currentYear = current.getFullYear();
const currentMonth = current.getMonth();
const currentDate = current.getDate();

function openWriteModal() {
  writeModalOverlay.classList.remove("hidden");
  date.value = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, "0")}-${currentDate.toString().padStart(2, "0")}`;
}

function closeWriteModal() {
  writeModalOverlay.classList.add("hidden");
  title.value = "";
  content.value = "";
  color.selectedIndex = 0;
  date.value = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, "0")}-${currentDate.toString().padStart(2, "0")}`;
}

function clickOutside(event) {
  if (event.target === writeModalOverlay) {
    closeWriteModal();
  }
}

function compareDates(a, b) {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  return dateB - dateA;
}

function writePost(event) {
  event.preventDefault();
  const post = {
    id: Math.random().toString(),
    title: title.value,
    date: date.value,
    color: color.value,
    content: content.value,
  };
  const postList = JSON.parse(localStorage.getItem("post")) ?? [];
  postList.unshift(post);
  postList.sort(compareDates);
  localStorage.setItem("post", JSON.stringify(postList));

  closeWriteModal();
  paintPost(postList);
}

function handleDeleteButton(event) {
  const postList = JSON.parse(localStorage.getItem("post")) ?? [];
  const newPostList = postList.filter(
    (postItem) => postItem.id !== event.target.parentElement.id
  );
  localStorage.setItem("post", JSON.stringify(newPostList));
  event.target.parentElement.remove();
}

function handleColorButton(event) {
  const postList = JSON.parse(localStorage.getItem("post")) ?? [];
  const newPostList = postList.filter(
    (postItem) => postItem.color === event.target.style.backgroundColor
  );
  paintPost(newPostList);
}

// DOM API 사용
function paintPost(postList) {
  postContainer.innerHTML = "";
  postList.forEach((postItem) => {
    const post = document.createElement("div");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button");
    deleteButton.style.background = postItem.color;
    deleteButton.addEventListener("click", handleDeleteButton);
    post.classList.add("post");
    post.id = postItem.id;
    post.innerHTML = /* html */ `
    <div class="post-title bold32">${postItem.title}</div>
    <div class="post-date medium12">${postItem.date}</div>
    <div class="post-content medium18">${postItem.content}</div>
    `;
    post.style.background = postItem.color;

    post.insertBefore(deleteButton, post.firstChild);
    postContainer.appendChild(post);
  });
}

// map + join 사용
// function paintPost(postList) {
//   postContainer.innerHTML = postList
//     .map(
//       (postItem) => /* html */ `
//       <div class="post" id="${postItem.id}" style="background: ${postItem.color}">
//         <button class="delete-button" style="background: ${postItem.color}">X</button>
//         <div class="post-title bold32">${postItem.title}</div>
//         <div class="post-date medium12">${postItem.date}</div>
//         <div class="post-content medium18">${postItem.content}</div>
//       </div>
//       `
//     )
//     .join("");

//   document.querySelectorAll(".delete-button").forEach((deleteButton) => {
//     deleteButton.addEventListener("click", handleDeleteButton);
//   });
// }

// reduce 사용
// function paintPost(postList) {
//   postContainer.innerHTML = postList.reduce(
//     (prev, postItem) =>
//       prev +
//       /* html */ `
//       <div class="post" id="${postItem.id}" style="background: ${postItem.color}">
//         <button class="delete-button" style="background: ${postItem.color}">X</button>
//         <div class="post-title bold32">${postItem.title}</div>
//         <div class="post-date medium12">${postItem.date}</div>
//         <div class="post-content medium18">${postItem.content}</div>
//       </div>
//       `,
//     ""
//   );

//   document.querySelectorAll(".delete-button").forEach((deleteButton) => {
//     deleteButton.addEventListener("click", handleDeleteButton);
//   });
// }

window.addEventListener("DOMContentLoaded", () => {
  const postList = JSON.parse(localStorage.getItem("post")) ?? [];
  paintPost(postList);
});
writeButton.addEventListener("click", openWriteModal);
cancelButton.addEventListener("click", closeWriteModal);
writeForm.addEventListener("submit", writePost);
colorButtons.forEach((colorButton) => {
  colorButton.addEventListener("click", handleColorButton);
});
writeModalOverlay.addEventListener("click", clickOutside);
