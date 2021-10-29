// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ieoDir = path.join(process.cwd(), "ieo");

export default function handler(req, res) {
  const fileNames = fs.readdirSync(ieoDir);
  const orderItems = fileNames.map((fileName) => {
    const fullPath = path.join(ieoDir, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContent);

    return matterResult.data;
  });

  return res.status(200).json(orderItems);
}
