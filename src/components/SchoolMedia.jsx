import { useState } from "react";

export default function SchoolMedia({ image, name, eager = false }) {
  const [failed, setFailed] = useState(null);
  return <div className="school-media">{image?.src && failed !== image.src
    ? <img src={image.src} alt={image.alt || name} style={{ objectPosition: image.position }} loading={eager ? "eager" : "lazy"} onError={() => setFailed(image.src)} />
    : <span role="img" aria-label={name}>{name.split(/\s+/).slice(0,2).map(s => s[0]).join("")}</span>}
  </div>;
}
