const BASE_URL = "http://127.0.0.1:8000/api";

function saveLogin(data){
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.user.first_name);
    localStorage.setItem(
        "is_profile_complete",
        data.is_profile_complete
    );
}

function redirectToDashboard(role){
    if(role === "admin"){
        window.location.href="dashboard-admin.html";
    }

    if(role === "host"){
        window.location.href="dashboard-host.html";
    }

    if(role === "tenant"){
        window.location.href="dashboard-tenant.html";
    }
}

function handleLoginSuccess(data){
    saveLogin(data);

    if(!data.is_profile_complete){
        window.location.href="complete-profile.html";
        return;
    }

    redirectToDashboard(data.role);
}

function checkProfileComplete(){
    const complete =
      localStorage.getItem("is_profile_complete")==="true";

    if(!complete){
        localStorage.setItem(
            "redirect_after_complete",
            window.location.href
        );

        window.location.href="complete-profile.html";
        return false;
    }

    return true;
}

function authHeaders(){
    return {
        "Content-Type":"application/json",
        "Accept":"application/json",
        "Authorization":
          "Bearer " + localStorage.getItem("token")
    };
}