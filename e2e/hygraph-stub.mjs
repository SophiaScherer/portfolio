// Stands in for the Hygraph API in CI, which builds without its secrets, so
// the tests that need CMS content (card images, galleries, the resume link)
// still run. Point HYGRAPH_ENDPOINT at it for both the build and the server.

import { createServer } from "node:http";

const PORT = Number(process.env.HYGRAPH_STUB_PORT ?? 3101);
const ORIGIN = `http://localhost:${PORT}`;

// 1x1 PNG.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

const asset = (fileName) => ({
  url: `${ORIGIN}/assets/${fileName}`,
  fileName,
  width: 1200,
  height: 800,
});

const PORTFOLIO = {
  data: {
    portfolios: [
      {
        resumeFile: { url: `${ORIGIN}/assets/resume.pdf`, fileName: "resume.pdf" },
        images: [
          "dashDetective.png",
          "unPawse.png",
          "vectorVisPicture.png",
          "dash-detective-gallery-1.png",
          "dash-detective-gallery-2.png",
          "dash-detective-gallery-3.png",
        ].map(asset),
      },
    ],
  },
};

createServer((req, res) => {
  if (req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(PORTFOLIO));
  } else if (req.url?.startsWith("/assets/") && req.url.endsWith(".png")) {
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(PNG);
  } else if (req.url === "/") {
    res.writeHead(200);
    res.end("ok");
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(PORT, () => console.log(`Hygraph stub listening on ${ORIGIN}`));
