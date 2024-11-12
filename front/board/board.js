const locationId = new URLSearchParams(window.location.search).get(
  "locationId"
);
let boardId;
const serverIPandPort = `${CONFIG.SERVER_URL}`;

async function loadBoardData() {
  try {
    const response = await fetch(
      `${serverIPandPort}/api/locations/board-posts?loc=${locationId}`
    );
    const data = await response.json();
    console.log("data from board.js = ", data);

    document.title = `${data.board.name}`;
    boardId = data.board.id;

    document.getElementById("board-title").textContent = `${data.board.name}`;

    const postsContainer = document.getElementById("posts-container");
    const noPostMessage = document.getElementById("no-post-message");

    if (data.board.posts.length === 0) {
      noPostMessage.style.display = "block";
    } else {
      noPostMessage.style.display = "none";
      data.board.posts.forEach(async (post) => {
        const postElement = document.createElement("div");
        const userNameRes = await fetch(
          `${serverIPandPort}/api/users/name/${post.authorId}`
        );
        const userData = await userNameRes.json();

        let status;
        if (post.lostItem.status === "FOUND") {
          status = "습득";
        } else {
          status = "반환";
        }

        postElement.className = "post-item";
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p>작성자: ${userData.username}</p> <!-- 작성자 이름 표시 -->
          <p>작성일: ${new Date(
            post.createdAt
          ).toLocaleDateString()}</p> <!-- 작성일 표시 -->
          <p>상태: ${status}</p>
          <button onclick="viewPost('${post.id}')">상세보기</button>
        `;
        postsContainer.appendChild(postElement);
      });
    }
  } catch (error) {
    console.error("Error loading board data:", error);
  }
}

// 게시물 등록 페이지로 이동
function goToRegister() {
  const user = JSON.parse(localStorage.getItem("user")); // 로그인 정보 확인
  if (!user) {
    alert("로그인이 필요한 기능입니다."); // 로그인하지 않은 경우 경고
    window.location.href = "../users/login/login.html"; // 로그인 페이지로 리디렉션
  } else {
    window.location.href = `../register/register.html?locationId=${locationId}&boardId=${boardId}`; // 로그인된 경우 등록 페이지로 이동
  }
}

function goToMap() {
  window.location.href = `../map/map.html`;
}

//홈으로
function goHome() {
  window.location.href = "../index.html";
}

function viewPost(postId) {
  window.location.href = `../post/post.html?postId=${postId}&locationId=${locationId}`;
}

window.onload = loadBoardData;
