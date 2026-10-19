package com.shop.service;

import com.shop.model.Order;
import com.shop.model.OrderItem;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

// Sends the "Order booked - please share payment details" email.
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.store.name}")
    private String storeName;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Returns true if the email was sent, false if it was not.
    // A failed email must never stop an order from being booked, so we catch every error here.
    public boolean sendOrderEmail(Order order) {
        String subject = "Order " + order.getOrderNumber() + " booked - please share your payment details";
        String html = buildHtml(order);

        // No email account set up yet (normal while developing): print the mail in the console.
        if (fromEmail == null || fromEmail.trim().length() == 0) {
            log.warn("Email is not configured (MAIL_USERNAME is empty). Email NOT sent. Would have sent to {} :\n{}",
                    order.getEmail(), subject);
            return false;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromEmail, storeName);
            helper.setTo(order.getEmail());
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Order email sent to {}", order.getEmail());
            return true;
        } catch (Exception e) {
            log.error("Could not send order email to {}: {}", order.getEmail(), e.getMessage());
            return false;
        }
    }

    private String buildHtml(Order order) {
        StringBuilder rows = new StringBuilder();
        for (int i = 0; i < order.getItems().size(); i++) {
            OrderItem item = order.getItems().get(i);
            rows.append("<tr>")
                .append("<td style='padding:10px 0;border-bottom:1px solid #e5e7eb'>")
                .append(escape(item.getProductName()))
                .append("<br><span style='color:#6b7280;font-size:12px'>Size: ")
                .append(escape(item.getSize())).append(" &nbsp;|&nbsp; Qty: ").append(item.getQuantity())
                .append("</span></td>")
                .append("<td style='padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right'>")
                .append(rupees(item.getLineTotal()))
                .append("</td></tr>");
        }

        String shippingText = "FREE";
        if (order.getShippingFee() > 0) {
            shippingText = rupees(order.getShippingFee());
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px'>");
        sb.append("<div style='max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden'>");

        // Header
        sb.append("<div style='background:#0f2742;color:#ffffff;padding:20px 28px'>")
          .append("<div style='font-size:20px;font-weight:bold'>").append(escape(storeName)).append("</div>")
          .append("<div style='font-size:13px;opacity:0.8'>Order confirmation</div></div>");

        sb.append("<div style='padding:28px;color:#111827;font-size:14px;line-height:1.6'>");
        sb.append("<p>Hi ").append(escape(order.getCustomerName())).append(",</p>");
        sb.append("<p>Thank you for your order! Your order <b>").append(escape(order.getOrderNumber()))
          .append("</b> is <b>booked</b>. We will confirm it as soon as we receive your payment details.</p>");

        // What we need from the customer
        sb.append("<div style='background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:16px;margin:20px 0'>")
          .append("<div style='font-weight:bold;margin-bottom:6px'>Action needed: share your payment details</div>")
          .append("Please <b>reply to this email</b> and tell us:<ol style='margin:8px 0 0 18px;padding:0'>")
          .append("<li>How you want to pay: UPI, bank transfer or Cash on Delivery</li>")
          .append("<li>Your UPI ID or the transaction reference (if you choose UPI or bank transfer)</li>")
          .append("</ol>")
          .append("<div style='margin-top:10px;font-size:12px;color:#1e3a8a'>For your safety, never send your full card number, CVV, PIN or OTP by email. We will never ask for them.</div>")
          .append("</div>");

        // Items
        sb.append("<div style='font-weight:bold;margin-bottom:4px'>Order details</div>");
        sb.append("<table style='width:100%;border-collapse:collapse'>").append(rows).append("</table>");

        // Totals
        sb.append("<table style='width:100%;margin-top:12px'>")
          .append("<tr><td style='color:#6b7280'>Subtotal</td><td style='text-align:right'>").append(rupees(order.getSubtotal())).append("</td></tr>")
          .append("<tr><td style='color:#6b7280'>Shipping</td><td style='text-align:right'>").append(shippingText).append("</td></tr>")
          .append("<tr><td style='padding-top:8px;font-weight:bold;font-size:16px'>Total to pay</td>")
          .append("<td style='padding-top:8px;text-align:right;font-weight:bold;font-size:16px'>").append(rupees(order.getTotalAmount())).append("</td></tr>")
          .append("</table>");

        // Shipping address
        sb.append("<div style='font-weight:bold;margin:24px 0 4px'>Shipping to</div>")
          .append("<div>").append(escape(order.getCustomerName())).append("<br>")
          .append(escape(order.getAddress())).append("<br>")
          .append(escape(order.getCity())).append(", ").append(escape(order.getState()))
          .append(" - ").append(escape(order.getPincode())).append("<br>")
          .append("Phone: ").append(escape(order.getPhone())).append("</div>");

        sb.append("<p style='margin-top:24px'>Thanks,<br>Team ").append(escape(storeName)).append("</p>");
        sb.append("</div></div></div>");
        return sb.toString();
    }

    // Writes a number like 1234567 as Rs 12,34,567 (Indian style grouping).
    private String rupees(int amount) {
        String digits = String.valueOf(amount);
        String result = "";
        int count = 0;
        for (int i = digits.length() - 1; i >= 0; i--) {
            if (count == 3 || (count > 3 && (count - 3) % 2 == 0)) {
                result = "," + result;
            }
            result = digits.charAt(i) + result;
            count++;
        }
        return "&#8377;" + result;
    }

    // Stops customer text like <script> from becoming real HTML inside the email.
    private String escape(String text) {
        if (text == null) {
            return "";
        }
        String result = text.replace("&", "&amp;");
        result = result.replace("<", "&lt;");
        result = result.replace(">", "&gt;");
        result = result.replace("\"", "&quot;");
        return result;
    }
}
