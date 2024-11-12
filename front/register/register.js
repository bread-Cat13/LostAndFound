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

async function fetchUserId() {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("user = ", user);
  const token = user ? user.accessToken : null;

  console.log("token = ", token);

  if (!token) {
    throw new Error("No access token found.");
  }

  const response = await fetch(`${serverIPandPort}/api/auth/user-id2`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("error!");
    throw new Error("Failed to fetch user ID");
  }

  // JSON 데이터를 파싱해서 userData에 저장
  const userData = await response.json();
  return userData.id; // ID 반환
}

async function submitPost(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const status = document.getElementById("status").value;
  const returnDate = document.getElementById("return-date").value;

  console.log("Here is submitPost method");

  // 사용자 ID 가져오기
  let authorId;
  try {
    authorId = await fetchUserId(); // ID 가져오기
  } catch (error) {
    alert("사용자 정보를 가져오는 데 실패했습니다.");
    console.error(error);
    return; // 함수 종료
  }

  const lostItem = {
    name: document.getElementById("lost-item-name").value,
    description: document.getElementById("description").value,
    foundDate: document.getElementById("found-date").value,
    returnDate: returnDate,
    status: status,
  };

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("authorId", authorId); // 가져온 ID 사용
  formData.append("lostItem", JSON.stringify(lostItem));

  const fileInput = document.getElementById("image-files");
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

window.onload = loadExistingData;
document.getElementById("post-form").addEventListener("submit", submitPost);
