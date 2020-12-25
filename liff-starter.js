let total_qty_food = 0;
let total_qty_drink = 0;
let total_price = 0;

window.onload = function() {
    const useNodeJS = false;
    const defaultLiffId = "1655449805-DBYZejA4";

    let myLiffId = "";

    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("is-login").classList.add('hidden');
                document.getElementById("is-not-login").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

function min(id) {
    let current_val = $('#'+id+'-qty').text();
    if ($.inArray( id, [ "minuman1", "minuman2"] ) >= 0) {
        total_qty_drink -= 1;
    }else{
        total_qty_food -= 1;
    }
    total_price -= (1 * 6000);
    if (parseInt(current_val) - 1 == 0) {
        $('#'+id+'-qty').addClass('visibility-hidden');
        $('.btn-'+id+'-min').addClass('visibility-hidden');
    }
    $('#'+id+'-qty').text(parseInt(current_val) - 1);

    $('.qty-total-food').text("Total : "+total_qty_food+" makanan, "+total_qty_drink+" minuman");
    $('.price-total-food').text("Harga : "+total_price);
}

function add(id) {
    let current_val = $('#'+id+'-qty').text();
    if ($.inArray( id, [ "minuman1", "minuman2"] ) >= 0) {
        total_qty_drink += 1;
    }else{
        total_qty_food += 1;
    }
    total_price += (1 * 6000);
    if (parseInt(current_val) + 1 > 0) {
        $('#'+id+'-qty').removeClass('visibility-hidden');
        $('.btn-'+id+'-min').removeClass('visibility-hidden');
    }
    $('#'+id+'-qty').text(parseInt(current_val) + 1);

    $('.qty-total-food').text("Total : "+total_qty_food+" makanan, "+total_qty_drink+" minuman");
    $('.price-total-food').text("Harga : "+total_price);
}

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("is-login").classList.add('hidden');
        document.getElementById("is-not-login").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("is-login").classList.add('hidden');
            document.getElementById("is-not-login").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers();
    if (liff.isLoggedIn()) {
        document.getElementById("is-login").classList.remove('hidden');
        document.getElementById("is-not-login").classList.add('hidden');
        liff.getProfile().then(function(profile) {
            $('#user-login-fullname').text(profile.displayName);
        }).catch(function(error) {
            window.alert('Error getting profile: ' + error);
        });
    } else {
        document.getElementById("is-login").classList.add('hidden');
        document.getElementById("is-not-login").classList.remove('hidden');
    }
}

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://dicoding-submission-wolfg.herokuapp.com/',
            external: true
        });
    });

    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': "Hi "+ $('#user-login-fullname').text() +", \n\nTerima kasih telah memesan makanan, berikut adalah review pesanananya: \n\n<b>* "+total_qty_food+ " Makanan\n* "+total_qty_drink+" Minuman</b>\n\nPesanan kakak akan segera diproses dan akan diberitahu jika sudah bisa diambil.\n\nMohon ditunggu yaa"
            }]).then(function() {
                // window.alert('Ini adalah pesan dari fitur Jajan Kuy');
                if (!liff.isInClient()) {
                    sendAlertIfNotInClient();
                } else {
                    liff.closeWindow();
                }
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });
}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}