import { Link, useLocation } from "react-router-dom";

const CONTENT = {
  "/about": {
    title: "About MyUsClothing",
    intro: "MyUsClothing is an apparel store focused on everyday clothing for men and kids.",
    sections: [
      ["Our approach", "We aim to make browsing and ordering straightforward, with clear product information and order totals before you place an order."],
      ["Product information", "Please review each product's description, colour, and size details before ordering. Colours may look slightly different depending on your screen."],
    ],
  },
  "/contact": {
    title: "Contact Us",
    intro: "We are here to help with questions about products, orders, delivery, returns, and refunds.",
    sections: [
      ["How to request help", "Contact the store using the customer-support email or phone number provided by the store owner on your official sales or order communications. Include your order number and the email address used at checkout."],
      ["Order and payment safety", "Do not send your card number, CVV, PIN, password, or OTP by email or message. If you have placed an order, keep your order confirmation for reference."],
      ["Response times", "Support requests are reviewed during business hours. A response time may vary depending on the volume and nature of the request."],
    ],
  },
  "/terms": {
    title: "Terms & Conditions",
    intro: "By using the MyUsClothing website or placing an order, you agree to these general terms.",
    sections: [
      ["Product listings and prices", "We try to keep product descriptions, images, sizes, availability, and prices accurate. Product availability and prices may change before an order is placed. If a listing contains a material error, we will contact the customer to resolve it."],
      ["Orders", "An order request is subject to availability and confirmation by the store. Please provide accurate contact and delivery details. We may contact you if information is incomplete or an order needs clarification."],
      ["Delivery", "Delivery estimates are indicative and may be affected by courier operations, weather, public holidays, or other events outside our control. Applicable shipping charges are displayed in the order summary before you place an order."],
      ["Acceptable use", "You agree not to misuse the website, interfere with its operation, or submit false order or contact information."],
      ["Updates", "These terms may be updated when store processes or applicable requirements change. The version displayed on this page applies to website use at that time."],
    ],
  },
  "/returns-refunds": {
    title: "Returns & Refunds Policy",
    intro: "We want you to be comfortable with your purchase. Please review the following return and refund guidance before requesting a return.",
    sections: [
      ["Return eligibility", "Contact customer support within 7 days of delivery to request a return or report an issue. Items should be unused, unwashed, unaltered, and returned with original tags and packaging. Items showing wear, damage caused after delivery, or missing tags may not be eligible. Hygiene-sensitive or clearly marked non-returnable items may be excluded where permitted by law."],
      ["Damaged, incorrect, or missing items", "Please contact support as soon as possible and provide your order number and clear photos of the issue so the request can be reviewed."],
      ["Return approval and pickup", "A return must be approved by customer support before sending an item back. Support will share the applicable return instructions. Do not send parcels to an address unless the store has confirmed it."],
      ["Refunds", "Once an approved return is received and inspected, the store will notify you of the outcome. Approved refunds will be processed to the original payment method where possible, or by another mutually agreed lawful method. Processing and bank timelines may vary."],
      ["Shipping charges", "Original delivery charges and return-shipping costs may not be refundable unless the item was incorrect, damaged, defective, or applicable law requires otherwise. Any applicable charge will be explained during the return process."],
      ["How to request a return", "Use the Contact Us page and include your order number, the item you want to return, the reason, and photos if the item is damaged or incorrect. This policy does not limit any rights available under applicable law."],
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    intro: "MyUsClothing uses the information you provide to operate the store and handle your orders.",
    sections: [
      ["Information we collect", "Information may include your name, contact details, delivery address, order items, and order history. Technical information may also be collected to keep the website secure and functioning."],
      ["How information is used", "We use order information to process purchases, arrange delivery, provide customer support, send order updates, prevent misuse, and meet applicable legal obligations."],
      ["Sharing", "Information may be shared with service providers such as delivery partners, hosting providers, and email providers only as needed to operate the service, or when required by law."],
      ["Security and retention", "We take reasonable steps to protect information, but no online system can be guaranteed completely secure. Information is retained only as needed for business, support, and legal purposes."],
      ["Your choices", "For a privacy-related request, contact the store using the customer-support details supplied in official store communications. This policy may be updated when practices or legal requirements change."],
    ],
  },
};

export default function StoreInfo() {
  const { pathname } = useLocation();
  const page = CONTENT[pathname] || CONTENT["/about"];

  return (
    <div className="container page">
      <div className="panel policy-panel">
        <p className="eyebrow">MYUSCLOTHING CUSTOMER INFORMATION</p>
        <h1 className="page-title">{page.title}</h1>
        <p className="policy-intro">{page.intro}</p>
        {page.sections.map(([heading, body]) => (
          <section className="policy-section" key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <div className="policy-note">These are general store policies. The store owner should review and update them to match actual business practices and applicable local law before launch.</div>
        <Link to="/" className="btn btn-primary">Back to shopping</Link>
      </div>
    </div>
  );
}
