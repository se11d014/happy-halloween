// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dayjs from "dayjs";

const ieoDir = path.join(process.cwd(), "ieo");

const getFilesData = (ieoDir) => {
  const fileNames = fs.readdirSync(ieoDir);
  const orderItems = fileNames.map((fileName) => {
    const fullPath = path.join(ieoDir, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContent);
    return matterResult.data;
  });

  return orderItems;
};

export default function handler(req, res) {
  const { method, body, headers } = req;
  console.log("headers", headers);

  if (method !== "POST") {
    return res
      .status(200)
      .json({ success: false, message: "Method not allowed" });
  }

  const _orderDate = dayjs().format();
  // const _randomId = String(Math.floor(Math.random() * 10000)).padStart(4, 0);
  const _files = fs.readdirSync(ieoDir);
  let orderItems = [];

  if (_files.length >= 10) {
    orderItems = getFilesData(ieoDir);
    return res.status(200).json(orderItems);
  }

  const { code, name } = body;
  fs.writeFileSync(
    ieoDir + `/${code}.md`,
    `---
code: ${code}
date: ${_orderDate}
name: ${name}
---
    `,
    (err, data) => {
      return;
    }
  );

  orderItems = getFilesData(ieoDir);
  return res.status(200).json(orderItems);
}
