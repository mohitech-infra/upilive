public class Main {
    public static void main(String[] args) {
        String[] cases = {
            "Received Rs. 1 from John Doe",
            "Received ₹ 1 from John Doe",
            "John Doe paid you Rs.1",
            "John Doe paid you ₹1",
            "credited with INR 1",
            "PhonePe: received Rs. 1 from John Doe",
            "PhonePe: received ₹ 1 from John Doe",
            "FamPay: received Rs. 1 from John Doe",
            "FamPay: received ₹ 1 from John Doe"
        };
        
        java.util.regex.Pattern p1 = java.util.regex.Pattern.compile("(?:received|credited)[\\s\\S]*?(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?).*?(?:from|by)\\s+([\\w\\s.]{2,40})", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern p2 = java.util.regex.Pattern.compile("([\\w\\s.]{2,40})\\s+paid\\s+you\\s+(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern p3 = java.util.regex.Pattern.compile("(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)\\s+(?:received|credited)", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Pattern amtPattern = java.util.regex.Pattern.compile("(?:Rs\\.?|INR|₹)\\s*([\\d,]+(?:\\.\\d{1,2})?)", java.util.regex.Pattern.CASE_INSENSITIVE);
        
        for (String text : cases) {
            java.util.regex.Matcher m1 = amtPattern.matcher(text);
            if (m1.find()) {
                System.out.println("Match for '" + text + "': " + m1.group(1));
            } else {
                System.out.println("No match for '" + text + "'");
            }
        }
    }
}
