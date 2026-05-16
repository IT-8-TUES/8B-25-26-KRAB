function closePopup() {
 window.location.href = "profile.html";
}

async function sendFriendRequest() {
    const input = document.getElementById("Name");
    const warning = document.getElementById("warning");
    const success = document.getElementById("success");
    const sendButton = document.getElementById("sendButton");
    const name = input.value.trim();

    warning.textContent = "";
    success.textContent = "";

    if (name === "") {
        warning.textContent = "Please enter a name";

        setTimeout(function() {
            warning.textContent = "";
        }, 3000);

        return;
    }

    try {
        sendButton.disabled = true;
        sendButton.textContent = "Sending...";

        const userId = window.firebaseConfig.getCurrentUserId();

        await window.firebaseConfig.db
            .collection("users")
            .doc(userId)
            .collection("friends")
            .add({
                name: name,
                status: "pending",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        success.textContent = "Friend request sent!";
        input.value = "";

        setTimeout(function() {
            window.location.href = "profile.html";
        }, 1200);
    } catch (error) {
        warning.textContent = "Something went wrong. Check Firebase setup.";
        console.error("Firebase save error:", error);
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Send friend request";
    }
}

window.closePopup = closePopup;
window.sendFriendRequest = sendFriendRequest;
