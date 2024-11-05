const postId = new URLSearchParams(window.location.search).get("postId");
const boardId = new URLSearchParams(window.location.search).get("boardId");
const locationId = new URLSearchParams(window.location.search).get(
  "locationId"
);
const serverIPandPort = `${CONFIG.SERVER_URL}`;

async function loadExistingData() {
  if (!postId) return;

  const response = await fetch(`${serverIPandPort}/api/posts/${postId}`);
  const post = await response.json();

  document.getElementById("title").value = post.title;
  document.getElementById("content").value = post.content;
  document.getElementById("author-id").value = post.authorId;
  document.getElementById("author-id").readOnly = true;

  if (post.lostItem) {
    document.getElementById("lost-item-name").value = post.lostItem.name;
    document.getElementById("description").value = post.lostItem.description;
    document.getElementById("found-date").value = post.lostItem.foundDate
      ? post.lostItem.foundDate.split("T")[0]
      : "";
    document.getElementById("return-date").value = post.lostItem.returnDate
      ? post.lostItem.returnDate.split("T")[0]
      : "";
    document.getElementById("status").value = post.lostItem.status;
  }

  const imageContainer = document.getElementById("image-preview");
  if (post.lostItem && post.lostItem.images) {
    post.lostItem.images.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
      img.alt = "Uploaded image";
      img.style.width = "100px";
      img.style.marginRight = "10px";
      imageContainer.appendChild(img);
    });
  }

  document.getElementById("submit-button").textContent = "수정하기";
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${serverIPandPort}/api/aws/single`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.imageUrl;
}

async function submitPost(event) {
  event.preventDefault();

  // 기본 데이터 수집
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const authorId = document.getElementById("author-id").value;
  const status = document.getElementById("status").value;
  const returnDate = document.getElementById("return-date").value;

  const lostItem = {
    name: document.getElementById("lost-item-name").value,
    description: document.getElementById("description").value,
    foundDate: document.getElementById("found-date").value,
    returnDate: returnDate,
    status: status,
  };

  // FormData에 데이터 추가
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("authorId", authorId);
  formData.append("lostItem", JSON.stringify(lostItem));

  // 파일을 FormData에 추가
  const fileInput = document.getElementById("image-files");
  if (fileInput.files.length === 0) {
    console.warn("No files selected.");
  }
  Array.from(fileInput.files).forEach((file) => {
    formData.append("files", file);
  });

  const url = postId
    ? `${serverIPandPort}/api/posts/${postId}?boardId=${boardId}`
    : `${serverIPandPort}/api/posts?boardId=${boardId}`;
  const method = postId ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (response.ok) {
      alert(
        postId
          ? "게시물이 성공적으로 수정되었습니다."
          : "게시물이 성공적으로 등록되었습니다."
      );
      window.location.href = postId
        ? `../post/post.html?postId=${postId}&locationId=${locationId}`
        : `../board/board.html?locationId=${locationId}`;
    } else {
      alert(
        postId ? "게시물 수정에 실패했습니다." : "게시물 등록에 실패했습니다."
      );
      console.error("요청 실패:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("서버 오류로 인해 작업에 실패했습니다.");
  }
}

// async function submitPost(event) {
//   event.preventDefault();

//   const title = document.getElementById("title").value;
//   const content = document.getElementById("content").value;
//   const authorId = document.getElementById("author-id").value;
//   const status = document.getElementById("status").value;
//   const returnDate = document.getElementById("return-date").value;

//   if (status === "CLAIMED" && !returnDate) {
//     alert("상태가 'CLAIMED'일 때는 반환 날짜를 입력해야 합니다.");
//     return;
//   }

//   const lostItem = {
//     name: document.getElementById("lost-item-name").value,
//     description: document.getElementById("description").value,
//     foundDate: document.getElementById("found-date").value,
//     returnDate: returnDate,
//     status: status,
//   };

//   let imageUrls = [];
//   const fileInput = document.getElementById("image-files");
//   if (fileInput.files.length > 0) {
//     const uploadPromises = Array.from(fileInput.files).map(uploadImage);
//     imageUrls = await Promise.all(uploadPromises);
//   }

//   const postData = {
//     title,
//     content,
//     authorId,
//     lostItem,
//     images: imageUrls,
//   };

//   const url = postId
//     ? `${serverIPandPort}/api/posts/${postId}?boardId=${boardId}`
//     : `${serverIPandPort}/api/posts?boardId=${boardId}`;
//   const method = postId ? "PATCH" : "POST";

//   try {
//     console.log(`create front에서 알립니다. boardId는 ${boardId}`);
//     const response = await fetch(url, {
//       method: method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(postData),
//     });

//     if (response.ok) {
//       alert(
//         postId
//           ? "게시물이 성공적으로 수정되었습니다."
//           : "게시물이 성공적으로 등록되었습니다."
//       );
//       window.location.href = postId
//         ? `../post/post.html?postId=${postId}&locationId=${locationId}`
//         : `../board/board.html?locationId=${locationId}`;
//     } else {
//       alert(
//         postId ? "게시물 수정에 실패했습니다." : "게시물 등록에 실패했습니다."
//       );
//       console.error("요청 실패:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("서버 오류로 인해 작업에 실패했습니다.");
//   }
// }

window.onload = loadExistingData;
document.getElementById("post-form").addEventListener("submit", submitPost);
