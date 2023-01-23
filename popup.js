const apiKey = "AIzaSyA8EF49WqMQkWAT2fYMT_yvZ8jDmnLaGWI";

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const url = tabs[0].url;
  const ul = document.getElementById("keywords");
  const videoId = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
  );

  const request = new Request(
    `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId[1]}&part=snippet`,
    { cache: "default" }
  );

  if (videoId) {
    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const keywords = data.items[0].snippet.tags;
        ul.textContent = "";
        if (!keywords) {
          ul.innerHTML = "<h3>No keywords found</h3>";
        }
        for (let i = 0; i < keywords.length; i++) {
          const li = document.createElement("li");
          li.textContent = keywords[i];
          ul.appendChild(li);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    ul.innerHTML = "<h3>This is not a youtube video page</h3>";
  }
});
