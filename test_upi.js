const UPI_PATTERNS = [
  // PhonePe: "You have received Rs.100 from John via PhonePe"
  {
    source: 'phonePe',
    regex: /(?:received|credited)[\s\S]*?(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)[\s\S]*?(?:from|by)\s+([\w\s.]+?)(?:\s+via\s+PhonePe|\s+on\s+PhonePe|$)/i,
    amountGroup: 1,
    nameGroup: 2,
  },
  // GPay: "NAME paid you Rs.100" or "You received Rs. 100 from NAME on Google Pay"
  {
    source: 'gPay',
    regex: /(?:([\w\s.]+?)\s+paid\s+you|received\s+(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)\s+from\s+([\w\s.]+?))\s+(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)?/i,
    amountGroup: 4, // Wait, if the first part matches, amount is in group 4? 
    nameGroup: 1,
  },
  // Paytm: "Received Rs X from NAME via Paytm"
  {
    source: 'paytm',
    regex: /(?:received|credited)[\s\S]*?(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)[\s\S]*?(?:from|by)\s+([\w\s.]+?)(?:\s+via\s+Paytm|$)/i,
    amountGroup: 1,
    nameGroup: 2,
  },
  // BHIM UPI / General UPI
  {
    source: 'bhim',
    regex: /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)\s+(?:received|credited)\s+from\s+(?:VPA\s+)?([\w.@]+)/i,
    amountGroup: 1,
    nameGroup: 2,
  },
  // Generic: any mention of amount received
  {
    source: 'generic',
    regex: /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)\s+(?:received|credited|deposited)/i,
    amountGroup: 1,
    nameGroup: -1,
  },
];

function parseUpiText(text) {
  for (const p of UPI_PATTERNS) {
    const m = text.match(p.regex);
    if (m) {
      const amountStr = m[p.amountGroup]?.replace(/,/g, '') ?? '0';
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) continue;

      const donor_name = (p.nameGroup > 0 ? m[p.nameGroup] : 'Anonymous')?.trim() ?? 'Anonymous';

      // Extract UTR/ref number
      const refMatch = text.match(/(?:UTR|Ref(?:erence)?(?:\s+No\.?)?|Txn\s+ID|UPI\s+Ref)[:\s]*([A-Z0-9]{10,22})/i);
      const upi_ref = refMatch?.[1] ?? '';

      return { amount, donor_name: donor_name.substring(0, 60), source: p.source, upi_ref };
    }
  }
  return null;
}

const tests = [
  "You received ₹1 from Anish via PhonePe",
  "Anish paid you ₹1",
  "You received ₹1 from Anish on Google Pay",
  "Received ₹1 from Anish via Paytm",
  "₹1 received from Anish",
  "FamPay: You received ₹1 from Anish",
  "credited with INR 1. Ref: 1234567890"
];

tests.forEach(t => {
  console.log("----");
  console.log(t);
  console.log(parseUpiText(t));
});
