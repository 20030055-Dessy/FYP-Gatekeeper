//Your web app's Firebase configuration (Derren) Line 1 - 20
import { initializeApp } from "../firebase/firebase-app.js";
import { getFirestore,doc,getDoc,addDoc, collection,setDoc,updateDoc} from "../firebase/firebase-firestore.js";

try{
const firebaseConfig = {
    apiKey: "AIzaSyB0udC16NX4I9wKM-_mECpBLD08c8FFfEM",
    authDomain: "fyp-firebase-c3a51.firebaseapp.com",
    databaseURL: "https://fyp-firebase-c3a51-default-rtdb.firebaseio.com",
    projectId: "fyp-firebase-c3a51",
    storageBucket: "fyp-firebase-c3a51.appspot.com",
    messagingSenderId: "495678944743",
    appId: "1:495678944743:web:d52f5b09af2feca1c97942"
  };

//Create instance of firebase api (Derren)
var firebase = initializeApp(firebaseConfig);
var db = getFirestore(firebase);


//Set key and value to chrome.storage
// chrome.storage.local.set({ 'www.google.com': "safe" });
// chrome.storage.local.set({ 'www.facebook.com': "safe" });
// chrome.storage.local.set({ 'www.youtube.com': "unsafe" });
// chrome.storage.local.set({ 'www.db.s.sg': "unsafe" });
// chrome.storage.local.set({ 'www.instagram.com': "safe" });


 
chrome.runtime.onMessage.addListener((msg, sender, resp) => {
  //Integration with checkFirebase- Derren
  //Local Storage related code - Dessy
  //auto validate the domain using the local storage, if found return the status else return "checkFirebase" to content script.
if(msg.command == "fetch"){
  let key = msg.data;
  chrome.storage.local.get(key, function (result) {
    
    if (result[key] !== undefined) {
      resp({ type: "result", status: "success", data: result[key], request: msg });
      
    }
    
    //check if the data is not exist then set the value as unknown
    else if (result[key] === undefined) {
      
      resp({ type: "result", status: "success", data: "checkFirebase", request: msg });
    }
  })
}
//Derren
//Query firebase for the status of the domain, if not found then create in unknown collection and return unknown status to content script.
if(msg.command =="checkFirebase"){
  getDoc(doc(db, "domain", msg.data)).then(docSnap => {

    if (docSnap.exists()) {
 
      chrome.storage.local.set({ [msg.data]: String(docSnap.get("status"))});
      resp({type: "result", status: "success", data: docSnap.get("status"), request: msg});
    } else {

      getDoc(doc(db, "unknown", msg.data)).then(docSnap => {
        if (docSnap.exists()==false){
          setDoc(doc(db, "unknown",msg.data), {
            status: "unknown",
            count: 1,
            domain:msg.data
          });
        }
      })

      resp({type: "result", status: "success", data: "unknown", request: msg});
    }
  })
}
//Line 78 - 88 Integration: Derren
//Line 91 - 110 Dessy
//Change the UI depending on the status of the website from msg.data
if(msg.command =="check"){


var status = "";
  if(msg.data == "checkFirebase"){
status = "unknown"
  }
  else{
    status = msg.data;
  }
  if (status=="safe") {
    
    
   chrome.action.setPopup({popup:"green.html"});
   chrome.action.setIcon({path: "/img/tab-icon-safe.png"});
    
  }
  else if(status=="unsafe"){
      chrome.action.setPopup({popup: "red.html"});
      chrome.action.setIcon({ path: "/img/tab-icon-dangerous.png"});
      console.log("dangerous");

      //Redirect to warning page
      chrome.tabs.update( {
              url: chrome.runtime.getURL('/warning.html')+ "?url=" + msg.data1
          });
  }
  
  else if(status=="unknown"){
    chrome.action.setPopup({popup: "yellow.html"});
    chrome.action.setIcon({ path: "/img/tab-icon-unknown.png"});
    console.log("unknown")       
}


}

//Derren
//Increment the count field in firebase 
if(msg.command=="increment"){
  console.log("hello");
  getDoc(doc(db, "domain", msg.data)).then(docSnap => {
    if (docSnap.exists()) {
      const domaindoc = doc(db, "domain", msg.data);
      updateDoc(domaindoc, {
        count: docSnap.get("count")+1
      });
      delay(1000);
      resp({type: "result", status: "success", data: docSnap.get("count")+1, request: msg});
    }  else{
      getDoc(doc(db, "unknown", msg.data)).then(docSnap => {
        if (docSnap.exists()) {
          const domaindoc = doc(db, "unknown", msg.data);
          updateDoc(domaindoc, {
            count: docSnap.get("count")+1
          });
          delay(1000);
          resp({type: "result", status: "success", data: docSnap.get("count")+1, request: msg});
        }
      })
    }
  })
}

return true;
})


//Dessy
//Set the default setting for the google extension to true for auto validation.
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'onOrOff': true }, result => {
      console.log("On Installed Set value to on")
    })
  })
  
  var isAutoValidationOn = true;
   //Dessy
   //When the user click on the auto validation button set it as false when the autovalidation is off 
   //and autovalidation is on then set it as true 
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'local' && changes.onOrOff) {
      console.log(changes.onOrOff.newValue)
      // auto is on
      if (changes.onOrOff.newValue) {
        isAutoValidationOn = true;
  
      }
      // auto is off
      else {
        console.log("Auto Validation Is Off")
        isAutoValidationOn = false;
  
      }
  
    }
  })
   
//Dessy
//When the page is refreshing set the icon and pop up to default. 
//When unsafe pop up page is loaded, this code is not runned to preserve the red icon.
chrome.tabs.onUpdated.addListener(function(tabId , info , tab) {

 if(tab.status === 'loading' && tab.url.startsWith("chrome-extension://")==false){ 
  chrome.storage.local.get(['onOrOff'], function (results) {
  if (results.onOrOff == false) {
  chrome.action.setPopup({ popup: "popup.html" });
  chrome.action.setIcon({ path: "/img/tab-icon.png" });
  }

 });  
}
  
 })


}catch(e){
  console.log(e);
}
  
   



function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}


  