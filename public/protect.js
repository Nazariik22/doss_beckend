(() => {
    const token = document.currentScript.getAttribute("data-token");
    const url = window.location.href;
    const referrer = document.referrer;
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();

    fetch("http://localhost:5000/api/logs/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, url, referrer, userAgent, timestamp })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Tracking success:", data);
        })
        .catch(err => {
            console.error("Tracking error:", err);
        });
})();