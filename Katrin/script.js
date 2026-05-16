function closePopup() {
 window.location.href = "profile.html";
}

function sendFriendRequest() {
    let name = document.getElementById("Name").value;
    let warning = document.getElementById("warning");

    if(name === ""){
        warning.textContent = "Please enter a name";

        setTimeout(function(){
            warning.textContent = "";
        }, 3000);
    }
    else{
        alert("Friend request sent!");
        window.location.href = "profile.html";
    }

}

