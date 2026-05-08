/**
 * BCA STORE - HTML & Web Development Knowledge Base
 * Training dataset for the AI Assistant.
 */

const HTML_KNOWLEDGE = {
  // HTML Basics
  "what is html": "HyperText Markup Language (HTML) is the standard markup language for creating web pages.",
  "who developed html": "HTML was developed by Tim Berners-Lee in 1991.",
  "is html a programming language": "No, HTML is a markup language. It is used to structure content, not to perform logical operations.",
  "doctype html": "The <!DOCTYPE html> declaration is an instruction to the web browser about what version of HTML the page is written in (HTML5).",
  "root tag": "The <html> tag is the container for all other HTML elements (except for the <!DOCTYPE> declaration).",

  // Core Tags
  "html head tag": "The <head> element contains metadata (data about data), such as the page title, character set, styles, and scripts.",
  "html body tag": "The <body> element contains all the visible content of a web page, such as headings, paragraphs, images, and links.",
  "heading tags": "HTML defines six levels of headings from <h1> (most important) to <h6> (least important).",
  "paragraph tag": "The <p> tag defines a paragraph of text.",
  "line break vs horizontal rule": "<br> creates a single line break; <hr> creates a thematic break (horizontal line).",

  // Formatting & Semantic HTML
  "strong and em tags": "<strong> is used for important text (usually bold); <em> is used for emphasized text (usually italic).",
  "semantic html": "Elements that clearly describe their meaning in a human- and machine-readable way (e.g., <header>, <footer>, <article>, <section>).",
  "div vs span": "<div> is a block-level container; <span> is an inline container.",

  // Links & Media
  "anchor tag": "The <a> tag defines a hyperlink, which is used to link from one page to another.",
  "href attribute": "The 'href' attribute specifies the URL of the page the link goes to.",
  "image tag": "The <img> tag is used to embed an image in a web page. It requires 'src' (source) and 'alt' (alternate text) attributes.",
  "video and audio tags": "HTML5 introduced <video> and <audio> elements to embed multimedia without external plugins.",

  // Tables & Lists
  "unordered vs ordered list": "<ul> creates a bulleted list; <ol> creates a numbered list. Each item is marked with <li>.",
  "table tags": "Tables are created using <table>, <tr> (row), <td> (data cell), and <th> (header cell).",
  "colspan and rowspan": "Attributes used to merge table cells across multiple columns or rows.",

  // Forms
  "html form": "The <form> element is used to collect user input. Common child elements include <input>, <textarea>, <button>, and <select>.",
  "get vs post": "GET appends form data to the URL (visible); POST sends form data in the body of the HTTP request (hidden/secure).",
  "input types": "Common types include text, password, checkbox, radio, submit, and email.",

  // HTML5 Advanced Features
  "canvas tag": "The <canvas> element is used to draw graphics on the fly via JavaScript.",
  "svg": "Scalable Vector Graphics (SVG) is an XML-based format for vector images that can be scaled without losing quality.",
  "localstorage": "Allows web applications to store data locally within the user's browser with no expiration date.",
  "responsive web design": "An approach to web design that makes web pages render well on a variety of devices and window or screen sizes.",
  "seo": "Search Engine Optimization; the process of improving the quality and quantity of website traffic from search engines."
};

// Merge into the global knowledge base
if (typeof BCA_BOT_KNOWLEDGE !== 'undefined') {
  Object.assign(BCA_BOT_KNOWLEDGE, HTML_KNOWLEDGE);
}
