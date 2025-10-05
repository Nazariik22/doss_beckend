(() => {
    const token = document.currentScript.getAttribute("data-token");
    const url = window.location.href;
    const referrer = document.referrer;
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toISOString();

    fetch("https://dossbeckend-c8b3f5f403da.herokuapp.com/api/logs/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, url, referrer, userAgent, timestamp })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Tracking success:", data);
            data.error==="Access denied. IP blocked." && alert('Вас заблоковано адміністратором сайту!');
            window.location.href = "https://www.google.com";
        })
        .catch(err => {
            console.error("Tracking error:", err);
        });
})();