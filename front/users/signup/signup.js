const serverUrl = `${CONFIG.SERVER_URL}`;

document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value; // ID 수정
    const password = document.getElementById("signup-password").value; // ID 수정

    const userData = {
      name: username,
      email,
      password,
    };

    try {
      const response = await fetch(`${serverUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        window.location.href = "../login/login.html"; // 로그인 페이지로 리디렉션
      } else {
        const errorData = await response.json(); // JSON 응답 받기
        throw new Error(errorData.message || "회원가입에 실패했습니다."); // 에러 메시지
      }
    } catch (error) {
      alert(error.message); // 에러 메시지 표시
    }
  });
