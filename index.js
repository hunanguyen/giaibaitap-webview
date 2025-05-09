function getSessionIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("sessionId");
}

const sessionId = getSessionIdFromUrl();
if (!sessionId) {
    console.error("No sessionId provided");

}

// Hàm gọi API
async function fetchData() {
    try {
        const response = await fetch(`http://localhost:8081/gbt/web/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Lấy các phần tử DOM
        const problemImageDiv = document.getElementById('problem-image');
        const problemTextDiv = document.getElementById('problem-text');
        const solutionDiv = document.getElementById('solution-content');

        // Ẩn cả hai phần trước khi kiểm tra
        problemImageDiv.style.display = 'none';
        problemTextDiv.style.display = 'none';

        const imageUrl = data.data.image_url;
        const text = data.data.text;
        const solution = data.data.solution;

        // Hiển thị hình ảnh đề bài nếu có
        if (imageUrl !== '' && imageUrl !== undefined) {
            problemImageDiv.innerHTML = `<img src="${imageUrl}" alt="Đề bài" />`;
            problemImageDiv.style.display = 'block';
        }

        // Hiển thị văn bản đề bài nếu có
        if (text !== '' && text !== undefined) {
            problemTextDiv.innerHTML = data.data.text;
            problemTextDiv.style.display = 'block';
        }

        // Nếu không có cả hai, hiển thị thông báo mặc định
        if (!imageUrl && !text) {
            problemTextDiv.innerHTML = `<p>Không có đề bài.</p>`;
            problemTextDiv.style.display = 'block';
        }

        // Hiển thị lời giải
        if (solution) {
            solutionDiv.innerHTML = solution;
            solutionDiv.style.whiteSpace = 'pre-wrap';
        } else {
            solutionDiv.innerHTML = `<p>Không có lời giải.</p>`;
        }

        // Render LaTeX bằng MathJax
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Gọi hàm fetchData khi trang được tải
document.addEventListener('DOMContentLoaded', fetchData);