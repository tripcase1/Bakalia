const fs = require('fs');

const pagePath = 'src/app/page.tsx';
let page = fs.readFileSync(pagePath, 'utf8');

const replacements = [
  {
    target: 'language === "en" ? "Safer" : "à¦¨à¦¿à¦°à¦¾à¦ªà¦¦"',
    replace: 't("safer")'
  },
  {
    target: 'language === "en" ? "Bakalia" : "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾"',
    replace: 't("bakalia")'
  },
  {
    target: 'language === "en" ? "Cancel SOS" : "à¦ à¦¸à¦“à¦ à¦¸ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à§ à¦¨"',
    replace: 't("cancelSos")'
  },
  {
    target: 'language === "en" ? "Sending SOS in" : "à¦ à¦¸à¦“à¦ à¦¸ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à¦šà§ à¦›à§‡"',
    replace: 't("sendingSosIn")'
  },
  {
    target: 'language === "en" ? "Next Prayer:" : "à¦ªà¦°à¦¬à¦°à§ à¦¤à§€ à¦¨à¦¾à¦®à¦¾à¦œ:"',
    replace: 't("nextPrayerLabel")'
  },
  {
    target: 'language === "en" ? "Show Less" : "à¦¸à¦‚à¦•à§ à¦·à¦¿à¦ªà§ à¦¤ à¦°à§‚à¦ª"',
    replace: 't("showLess")'
  },
  {
    target: 'language === "en" ? "View All Services" : "à¦¸à¦•à¦² à¦¸à§‡à¦¬à¦¾à¦¸à¦®à§‚à¦¹ à¦¦à§‡à¦–à§ à¦¨"',
    replace: 't("viewAllServices")'
  },
  {
    target: 'language === "en" ? "Welcome Back" : "à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦¸à§ à¦¬à¦¾à¦—à¦¤à¦®"',
    replace: 't("welcomeBack")'
  },
  {
    target: 'language === "en" ? "Create Account" : "à¦¨à¦¤à§ à¦¨ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦¤à§ˆà¦°à¦¿"',
    replace: 't("createAccount")'
  },
  {
    target: 'language === "en" ? "Access your Bakalia portal account" : "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦ªà§‹à¦°à§ à¦Ÿà¦¾à¦² à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦…à§ à¦¯à¦¾à¦•à§ à¦¸à§‡à¦¸ à¦•à¦°à§ à¦¨"',
    replace: 't("accessAccountDesc")'
  },
  {
    target: 'language === "en" ? "Sign up to join our smart community" : "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à§ à¦®à¦¾à¦°à§ à¦Ÿ à¦¸à¦®à¦¾à¦œà§‡ à¦¯à§‹à¦— à¦¦à¦¿à¦¤à§‡ à¦¨à¦¿à¦¬à¦¨à§ à¦§à¦¨ à¦•à¦°à§ à¦¨"',
    replace: 't("joinCommunityDesc")'
  },
  {
    target: 'language === "en" ? "Phone OTP" : "à¦«à§‹à¦¨ à¦“à¦Ÿà¦¿à¦ªà¦¿"',
    replace: 't("phoneOtp")'
  },
  {
    target: 'language === "en" ? "Email" : "à¦‡à¦®à§‡à¦‡à¦²"',
    replace: 't("email")'
  },
  {
    target: 'language === "en" ? "Full Name" : "à¦¸à¦®à§ à¦ªà§‚à¦°à§ à¦£ à¦¨à¦¾à¦®"',
    replace: 't("fullName")'
  },
  {
    target: 'language === "en" ? "Phone Number" : "à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§ à¦¬à¦°"',
    replace: 't("phoneNumber")'
  },
  {
    target: 'language === "en" ? "Email Address" : "à¦‡à¦®à§‡à¦‡à¦² à¦ à¦¿à¦•à¦¾à¦¨à¦¾"',
    replace: 't("emailAddress")'
  },
  {
    target: 'language === "en" ? "Password" : "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§ à¦¡"',
    replace: 't("password")'
  },
  {
    target: 'language === "en" ? "Sign In" : "à¦²à¦—à¦‡à¦¨ à¦•à¦°à§ à¦¨"',
    replace: 't("signIn")'
  },
  {
    target: 'language === "en" ? "Register Account" : "à¦¨à¦¿à¦¬à¦¨à§ à¦§à¦¨ à¦¸à¦®à§ à¦ªà¦¨à§ à¦¨ à¦•à¦°à§ à¦¨"',
    replace: 't("registerBtn")'
  },
  {
    target: 'language === "en" ? "New to Bakalia?" : "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦•à¦®à¦¿à¦‰à¦¨à¦¿à¦Ÿà¦¿à¦¤à§‡ à¦¨à¦¤à§ à¦¨?"',
    replace: 't("newToBakalia")'
  },
  {
    target: 'language === "en" ? "Create an account" : "à¦¨à¦¤à§ à¦¨ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦–à§ à¦²à§ à¦¨"',
    replace: 't("createAnAccount")'
  },
  {
    target: 'language === "en" ? "Already have an account?" : "à¦‡à¦¤à¦¿à¦®à¦§à§ à¦¯à§‡ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦¾à¦›à§‡?"',
    replace: 't("alreadyHaveAccount")'
  },
  {
    target: 'language === "en" ? "Log in here" : "à¦  à¦–à¦¾à¦¨à§‡ à¦²à¦—à¦‡à¦¨ à¦•à¦°à§ à¦¨"',
    replace: 't("loginHere")'
  },
  {
    target: 'language === "en" ? "Do you really need help now?" : "à¦†à¦ªà¦¨à¦¾à¦° à¦•à¦¿ à¦¸à¦¤à§ à¦¯à¦¿à¦‡ à¦œà¦°à§ à¦°à¦¿ à¦¸à¦¾à¦¹à¦¾à¦¯à§ à¦¯ à¦ªà§ à¦°à§Ÿà§‹à¦œà¦¨?"',
    replace: 't("sosConfirmTitle")'
  },
  {
    target: 'description: language === "en" ? "This will send an emergency SOS alert with your GPS location to the Thana police and local volunteers." : "à¦ à¦Ÿà¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦œà¦¿à¦ªà¦¿à¦ à¦¸ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¸à¦¹ à¦¥à¦¾à¦¨à¦¾ à¦ªà§ à¦²à¦¿à¦¶ à¦ à¦¬à¦‚ à¦¸à§ à¦¥à¦¾à¦¨à§€à¦¯à¦¼ à¦¸à§ à¦¬à§‡à¦šà§ à¦›à¦¾à¦¸à§‡à¦¬à¦•à¦¦à§‡à¦° à¦•à¦¾à¦›à§‡ à¦ à¦•à¦Ÿà¦¿ à¦œà¦°à§ à¦°à¦¿ à¦ à¦¸à¦“à¦ à¦¸ à¦…à§ à¦¯à¦¾à¦²à¦¾à¦°à§ à¦Ÿ à¦ªà¦¾à¦ à¦¾à¦¬à§‡à¥¤"',
    replace: 'description: t("sosConfirmDesc")'
  },
  {
    target: 'language === "en" ? "Cancel" : "à¦¬à¦¾à¦¤à¦¿à¦²"',
    replace: 't("cancel")'
  },
  {
    target: 'language === "en" ? "Yes, I Need Help" : "à¦¹à§ à¦¯à¦¾à¦ , à¦¸à¦¾à¦¹à¦¾à¦¯à§ à¦¯ à¦²à¦¾à¦—à¦¬à§‡"',
    replace: 't("yesINeedHelp")'
  }
];

let replacedCount = 0;
replacements.forEach(r => {
  if (page.includes(r.target)) {
    page = page.replace(new RegExp(escapeRegExp(r.target), 'g'), r.replace);
    replacedCount++;
  } else {
    console.log(`Warning: Not found in page.tsx: \n${r.target}`);
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log(`Precise replacements done: ${replacedCount} / ${replacements.length}`);
