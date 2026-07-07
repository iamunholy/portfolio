const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 4174;
const root = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

http
  .createServer((request, response) => {
    const requestPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
    let cleanPath;

    try {
      cleanPath = decodeURIComponent(requestPath);
    } catch {
      response.writeHead(400);
      response.end("Bad Request");
      return;
    }

    const filePath = path.normalize(path.join(root, cleanPath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError) {
        response.writeHead(statError.code === "ENOENT" ? 404 : 500);
        response.end(statError.code === "ENOENT" ? "Not Found" : "Server Error");
        return;
      }

      if (stats.isDirectory()) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      const ext = path.extname(filePath);
      const mimeType = mimeTypes[ext] || "application/octet-stream";

      if (ext === ".mp4") {
        const range = request.headers.range;

        if (range) {
          const [startText, endText] = range.replace(/bytes=/, "").split("-");
          const start = Number(startText);
          const end = endText ? Number(endText) : stats.size - 1;

          if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= stats.size) {
            response.writeHead(416, {
              "Content-Range": `bytes */${stats.size}`,
            });
            response.end();
            return;
          }

          response.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${stats.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": mimeType,
          });

          fs.createReadStream(filePath, { start, end }).pipe(response);
          return;
        }

        response.writeHead(200, {
          "Accept-Ranges": "bytes",
          "Content-Length": stats.size,
          "Content-Type": mimeType,
        });

        fs.createReadStream(filePath).pipe(response);
        return;
      }

      fs.readFile(filePath, (error, content) => {
        if (error) {
          response.writeHead(error.code === "ENOENT" ? 404 : 500);
          response.end(error.code === "ENOENT" ? "Not Found" : "Server Error");
          return;
        }

        response.writeHead(200, {
          "Content-Type": mimeType,
        });
        response.end(content);
      });
    });
  })
  .listen(port, () => {
    console.log(`Portfolio site available at http://localhost:${port}`);
  });
