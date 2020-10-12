
function register() {
    if ('serviceWorker' in navigator &&  navigator.onLine) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(function(reg) {
                // registration worked
                console.log('Registration succeeded. Scope is ' + reg.scope);
            }).catch(function(error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }
}

register();