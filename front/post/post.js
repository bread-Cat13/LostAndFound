const postId = new URLSearchParams(window.location.search).get("postId");
const locationId = new URLSearchParams(window.location.search).get(
  "locationId"
);
const serverIPandPort = `${CONFIG.SERVER_URL}`;

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

async function loadPostData() {
  if (!postId) {
    console.error("postId가 URL에 없습니다.");
    return;
  }

  try {
    const response = await fetch(`${serverIPandPort}/api/posts/${postId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post data: ${response.statusText}`);
    }
    const post = await response.json();
    const authorId = post.authorId;
    const currentUserId = await fetchUserId();

    console.log(`authorId=${authorId}, curUserId=${currentUserId}`);

    const userNameRes = await fetch(
      `${serverIPandPort}/api/users/name/${authorId}`
    );
    const userData = await userNameRes.json();

    console.log("post from post.js =", post);

    // 게시물 데이터 렌더링
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-content").textContent = post.content;
    document.getElementById("author-username").textContent = userData.username;

    document.getElementById(
      "post-status"
    ).textContent = `상태: ${post.lostItem.status}`;

    document.getElementById(
      "post-foundDate"
    ).textContent = `분실 날짜: ${new Date(
      post.lostItem.foundDate
    ).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })}`;

    document.getElementById("post-returnDate").textContent = `반환 날짜: ${
      post.lostItem.returnDate
        ? new Date(post.lostItem.returnDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "반환 전"
    }`;

    // 이미지 표시
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ""; // 기존 이미지 초기화
    if (post.lostItem.images && post.lostItem.images.length > 0) {
      post.lostItem.images.forEach((image) => {
        const img = document.createElement("img");
        img.src = image; // image가 URL 문자열이라면 이렇게 수정
        img.alt = "분실물 이미지";
        img.className = "lost-item-image";
        imageContainer.appendChild(img);
      });
    } else {
      imageContainer.textContent = "이미지가 없습니다.";
    }

    // 작성자와 현재 로그인한 사용자 비교 후 버튼 표시
    const buttonContainer = document.getElementById("button-container");
    if (authorId === currentUserId) {
      buttonContainer.style.display = "flex"; // 버튼 표시
    } else {
      buttonContainer.style.display = "none"; // 버튼 숨기기
    }
  } catch (error) {
    console.error("Error loading post data:", error);
    alert("게시물 데이터를 불러오지 못했습니다.");
  }
}

// 수정 페이지로 이동하는 함수
function goToEditPage() {
  window.location.href = `../register/register.html?postId=${postId}&locationId=${locationId}`;
}

// 삭제하기 기능
async function deletePost() {
  const confirmDelete = confirm("정말 이 게시물을 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${serverIPandPort}/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("게시물이 삭제되었습니다.");
      window.location.href = `../board/board.html?locationId=${locationId}`;
    } else {
      alert("게시물 삭제에 실패했습니다.");
      console.error("삭제 실패:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("서버 오류로 인해 게시물 삭제에 실패했습니다.");
  }
}

// 게시판으로 돌아가는 함수
function goBack() {
  window.location.href = `../board/board.html?locationId=${locationId}`;
}

document.getElementById("back-board").addEventListener("click", goBack);
window.onload = loadPostData;
