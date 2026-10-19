import { useState } from "react";
import Garment from "./Garment.jsx";

// Shows the product photo. If the photo file is missing, it shows the clothing drawing instead,
// so the shop never has a broken picture.
//
// product needs:  name, type, color  and (optional)  imageUrl  like "/images/products/some-name.jpg"
// The photo can be .jpg, .jpeg, .png or .webp - we try each one before giving up.
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

// "/images/products/shirt.jpg" -> ["/images/products/shirt.jpg", ".../shirt.jpeg", ".../shirt.png", ".../shirt.webp"]
function photoChoices(imageUrl) {
  if (!imageUrl) {
    return [];
  }
  const dot = imageUrl.lastIndexOf(".");
  if (dot < 0) {
    return [imageUrl];
  }
  const base = imageUrl.substring(0, dot);
  const choices = [imageUrl];
  for (const ext of EXTENSIONS) {
    const candidate = base + "." + ext;
    if (candidate !== imageUrl) {
      choices.push(candidate);
    }
  }
  return choices;
}

export default function ProductImage({ product, className }) {
  const [attempt, setAttempt] = useState(0);   // which photo file we are trying
  const choices = photoChoices(product.imageUrl);
  const tint = { background: product.color + "1f" };

  // Photo (while there are still file names left to try)
  if (attempt < choices.length) {
    return (
      <div className={"product-image has-photo " + (className || "")} style={tint}>
        <img
          src={choices[attempt]}
          alt={product.name}
          loading="lazy"
          onError={() => setAttempt(attempt + 1)}
        />
      </div>
    );
  }

  // No photo found: show the drawing
  return (
    <div className={"product-image " + (className || "")} style={tint}>
      <Garment type={product.type} color={product.color} />
    </div>
  );
}
