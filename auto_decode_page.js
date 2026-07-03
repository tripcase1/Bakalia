const fs = require('fs');

const pagePath = 'src/app/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');
let lines = content.split('\n');

let totalFixed = 0;

// Correct translations mappings for strings that might be partially lost due to text editor corruption
const overrideFixes = {
  // If the automated decoding yields corrupted characters like replacement character or weird symbols,
  // we override them with the exact correct Bengali strings from AppContext.tsx
  "à¦ à¦¸à¦“à¦ à¦¸ à¦¬à¦¾à¦¤à¦¿à¦² à¦•à¦°à§ à¦¨": "cancelSos",
  "à¦ à¦¸à¦“à¦ à¦¸ à¦ªà¦¾à¦ à¦¾à¦¨à§‹ à¦¹à¦šà§ à¦›à§‡": "sendingSosIn",
  "à¦ªà¦°à¦¬à¦°à§ à¦¤à§€ à¦¨à¦¾à¦®à¦¾à¦œ:": "nextPrayerLabel",
  "à¦¸à¦‚à¦•à§ à¦·à¦¿à¦ªà§ à¦¤ à¦°à§‚à¦ª": "showLess",
  "à¦¸à¦•à¦² à¦¸à§‡à¦¬à¦¾à¦¸à¦®à§‚à¦¹ à¦¦à§‡à¦–à§ à¦¨": "viewAllServices",
  "à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦¸à§ à¦¬à¦¾à¦—à¦¤à¦®": "welcomeBack",
  "à¦¨à¦¤à§ à¦¨ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦¤à§ˆà¦°à¦¿": "createAccount",
  "à¦†à¦ªà¦¨à¦¾à¦° à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦ªà§‹à¦°à§ à¦Ÿà¦¾à¦² à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦…à§ à¦¯à¦¾à¦•à§ à¦¸à§‡à¦¸ à¦•à¦°à§ à¦¨": "accessAccountDesc",
  "à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à§ à¦®à¦¾à¦°à§ à¦Ÿ à¦¸à¦®à¦¾à¦œà§‡ à¦¯à§‹à¦— à¦¦à¦¿à¦¤à§‡ à¦¨à¦¿à¦¬à¦¨à§ à¦§à¦¨ à¦•à¦°à§ à¦¨": "joinCommunityDesc",
  "à¦«à§‹à¦¨ à¦“à¦Ÿà¦¿à¦ªà¦¿": "phoneOtp",
  "à¦‡à¦®à§‡à¦‡à¦²": "email",
  "à¦¸à¦®à§ à¦ªà§‚à¦°à§ à¦£ à¦¨à¦¾à¦®": "fullName",
  "à¦®à§‹à¦¬à¦¾à¦‡à¦² à¦¨à¦®à§ à¦¬à¦°": "phoneNumber",
  "à¦‡à¦®à§‡à¦‡à¦² à¦ à¦¿à¦•à¦¾à¦¨à¦¾": "emailAddress",
  "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§ à¦¡": "password",
  "à¦²à¦—à¦‡à¦¨ à¦•à¦°à§ à¦¨": "signIn",
  "à¦¨à¦¿à¦¬à¦¨à§ à¦§à¦¨ à¦¸à¦®à§ à¦ªà¦¨à§ à¦¨ à¦•à¦°à§ à¦¨": "registerBtn",
  "à¦¬à¦¾à¦•à¦²à¦¿à¦¯à¦¼à¦¾ à¦•à¦®à¦¿à¦‰à¦¨à¦¿à¦Ÿà¦¿à¦¤à§‡ à¦¨à¦¤à§ à¦¨?": "newToBakalia",
  "à¦¨à¦¤à§ à¦¨ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦–à§ à¦²à§ à¦¨": "createAnAccount",
  "à¦‡à¦¤à¦¿à¦®à¦§à§ à¦¯à§‡ à¦…à§ à¦¯à¦¾à¦•à¦¾à¦‰à¦¨à§ à¦Ÿ à¦†à¦›à§‡?": "alreadyHaveAccount",
  "à¦ à¦–à¦¾à¦¨à§‡ à¦²à¦—à¦‡à¦¨ à¦•à¦°à§ à¦¨": "loginHere",
  "à¦†à¦ªà¦¨à¦¾à¦° à¦•à¦¿ à¦¸à¦¤à§ à¦¯à¦¿à¦‡ à¦œà¦°à§ à¦°à¦¿ à¦¸à¦¾à¦¹à¦¾à¦¯à§ à¦ザー à¦ªà§ à¦°à§Ÿà§‹à¦œà¦¨?": "sosConfirmTitle",
  "à¦†à¦ªà¦¨à¦¾à¦° à¦•à¦¿ à¦¸à¦¤à§ à¦¯à¦¿à¦‡ à¦œà¦°à§ à¦°à¦¿ à¦¸à¦¾à¦¹à¦¾à¦¯à§ à¦¯ à¦ªà§ à¦°à§Ÿà§‹à¦œà¦¨?": "sosConfirmTitle",
  "à¦ à¦Ÿà¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦œà¦¿à¦ªà¦¿à¦ à¦¸ à¦²à§‹à¦•à§‡à¦¶à¦¨ à¦¸à¦¹ à¦¥à¦¾à¦¨à¦¾ à¦ªà§ à¦²à¦¿à¦¶ à¦ à¦¬à¦‚ à¦¸à§ à¦¥à¦¾à¦¨à§€à¦¯à¦¼ à¦¸à§ à¦¬à§‡à¦šà§ à¦›à¦¾à¦¸à§‡à¦¬à¦•à¦¦à§‡à¦° à¦•à¦¾à¦›à§‡ à¦ à¦•à¦Ÿà¦¿ à¦œà¦°à§ à¦°à¦¿ à¦ à¦¸à¦“à¦ à¦¸ à¦…à§ à¦¯à¦¾à¦²à¦¾à¦°à§ à¦Ÿ à¦ªà¦¾à¦ à¦¾à¦¬à§‡à¥¤": "sosConfirmDesc",
  "à¦¬à¦¾à¦¤à¦¿à¦²": "cancel",
  "à¦¹à§ à¦¯à¦¾à¦ , à¦¸à¦¾à¦¹à¦¾à¦¯à§ à¦¯ à¦²à¦¾à¦—à¦¬à§‡": "yesINeedHelp"
};

// Also basic word decoding for simple ones that are clean
function decodeSimple(str) {
  return Buffer.from(str, 'latin1').toString('utf8');
}

lines = lines.map((line, lineIdx) => {
  if (line.includes('à¦') || line.includes('à§')) {
    // Let's replace the inline ternary or double-encoded strings
    // We match any string in quotes or backticks
    const stringRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g;
    let newLine = line;
    let match;
    
    // We run matches
    while ((match = stringRegex.exec(line)) !== null) {
      const fullStr = match[0];
      const quoteChar = fullStr[0];
      const inner = fullStr.slice(1, -1);
      
      if (inner.includes('à¦') || inner.includes('à§')) {
        // Let's see if we have an override for this string or sub-string
        let resolvedKey = null;
        Object.keys(overrideFixes).forEach(k => {
          if (inner.includes(k)) {
            resolvedKey = overrideFixes[k];
          }
        });
        
        if (resolvedKey) {
          // If we found a key, we replace the entire ternary expression in that line with t("key")!
          // We look for patterns like: language === "en" ? "English" : "corrupted"
          // Or fullStr itself
          console.log(`[Line ${lineIdx + 1}] Replacing corrupted string literal with t("${resolvedKey}")`);
          
          // Let's construct a regex to match the ternary pattern that contains this string literal:
          // e.g. language === "en" ? "..." : "corrupted"
          // or: (language === "en" ? "..." : "corrupted")
          const ternaryRegex = new RegExp(`\\(?[a-zA-Z0-9_.]+\\s*===\\s*"en"\\s*\\?\\s*"(?:[^"\\\\]|\\\\.)*"\\s*:\\s*` + escapeRegExp(fullStr) + `\\)?|\\(?[a-zA-Z0-9_.]+\\s*===\\s*"en"\\s*\\?\\s*'(?:[^'\\\\]|\\\\.)*'\\s*:\\s*` + escapeRegExp(fullStr) + `\\)?`, 'g');
          
          if (ternaryRegex.test(newLine)) {
            newLine = newLine.replace(ternaryRegex, `t("${resolvedKey}")`);
          } else {
            // Direct replacement of the string literal if not a simple ternary format
            newLine = newLine.replace(fullStr, `t("${resolvedKey}")`);
          }
          totalFixed++;
        } else {
          // Fallback to simple decoding if no override key matches
          const decoded = decodeSimple(inner);
          console.log(`[Line ${lineIdx + 1}] Decoding: ${inner} -> ${decoded}`);
          newLine = newLine.replace(fullStr, `${quoteChar}${decoded}${quoteChar}`);
          totalFixed++;
        }
      }
    }
    
    // Also handle special edge cases like description: language === "en" ? "..." : "corrupted" where double quotes are used:
    if (newLine.includes('à¦') || newLine.includes('à§')) {
      // If still not fully fixed, let's do a direct replacement of known corrupted text
      Object.keys(overrideFixes).forEach(k => {
        if (newLine.includes(k)) {
          const key = overrideFixes[k];
          console.log(`[Line ${lineIdx + 1}] Direct fallback replacement for key: ${key}`);
          // Replace the pattern matching language === "en" ? "..." : "k" or description: ...
          const regexStr = `(?:language\\s*===\\s*"en"\\s*\\?\\s*"(?:[^"\\\\]|\\\\.)*"\\s*:\\s*"${escapeRegExp(k)}")|(?:\`[^\`]*\`)`;
          newLine = newLine.replace(new RegExp(regexStr, 'g'), `t("${key}")`);
          
          // Just replace the literal raw occurrence of "k" or 'k' with t("key")
          newLine = newLine.replace(new RegExp(`"${escapeRegExp(k)}"|'${escapeRegExp(k)}'`, 'g'), `t("${key}")`);
          totalFixed++;
        }
      });
    }
    
    return newLine;
  }
  return line;
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

fs.writeFileSync(pagePath, lines.join('\n'), 'utf8');
console.log(`Auto decoding completed. Total items processed/fixed: ${totalFixed}`);
