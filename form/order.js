const txn_id = 'txn_id_' + Math.floor(Math.random() * 1001)
const accountNumber = 'oid' + Math.floor(Math.random() * 101)
let tomorrow = new Date();
tomorrow.setDate(new Date().getDate()+1);
const tomorrow_str = tomorrow.getFullYear() + "-" +
("00" + (tomorrow.getMonth() + 1)).slice(-2) + "-" +
("00" + tomorrow.getDate()).slice(-2) + " " +
("00" + tomorrow.getHours()).slice(-2) + ":" +
("00" + tomorrow.getMinutes()).slice(-2) + ":" +
("00" + tomorrow.getSeconds()).slice(-2);
const checkout_payload = {
    merchantTransactionID: txn_id,
    requestAmount: "100",
    currencyCode: "KES",
    accountNumber: accountNumber,
    serviceCode: 'PAYDEV2608',
    dueDate: tomorrow_str, //Must be a future date
    requestDescription: "Dummy merchant transaction",
    countryCode: "KE",
    languageCode: "en",
    payerClientCode: "",
    MSISDN: "+254724419446", //Must be a valid number
    customerFirstName: "Andrew",
    customerLastName: "Ouko",
    customerEmail: "andrew.ouko@cellulant.io",
    successRedirectUrl: "http://localhost:4000/success",
    failRedirectUrl: "http://localhost:4000/failed",
    pendingRedirectUrl: "http://localhost:4000/pending",
    paymentWebhookUrl: "http://localhost:4000/webhook",
    modal: false
}
// console.log(checkout_payload)

function submitCheckoutPayload(){
    // console.log(document.querySelector('#form'))
    var formData = new FormData(document.querySelector('#form'))
    // console.log(formData.get('merchantTransactionID'))
    let data = {}; let checkout_url = '';
    formData.forEach(function(value, key){
        if(key !== 'modal') data[key] = value;
    });
    console.log(data)
    fetch('http://localhost:4000/checkout', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(r => r.json()).then(res => {
        console.log(res)
        if(document.getElementById('modal').checked){
            checkout_url = encodeURI(`https://developer.tingg.africa/checkout/v2/modal/?accessKey=${res.accessKey}&params=${res.encrypted_payload}&countryCode=${res.countryCode}`)
            var left = 400;
            var top = 200;
            window.open(checkout_url, 'Checkout Modal', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 290 + ', height=' + 595 + ', top=' + top + ', left=' + left);
        }
        else{
            // checkout_url = encodeURI(`https://developer.tingg.africa/checkout/v2/express/?accessKey=${res.accessKey}&params=${res.encrypted_payload}&countryCode=${res.countryCode}`)
            checkout_url = encodeURI(`http://localhost:3010/checkout?accessKey=${res.accessKey}&params=${res.encrypted_payload}&countryCode=${res.countryCode}`)
            window.location.replace(checkout_url)
        }
    })
}