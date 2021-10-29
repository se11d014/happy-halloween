// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ieoDir = path.join(process.cwd(), "ieo");

export function getAllIEOIds() {
  const fileNames = fs.readdirSync(ieoDir);
  return fileNames.map((fname) => {
    return {
      params: {
        id: fname.replace(/\.md$/, ""),
      },
    };
  });
}

export function getIEOData(id) {
  const fullPath = path.join(ieoDir, `${id}.md`);
  const ieoContent = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(ieoContent);
  const {
    data: { date, ...rest },
  } = matterResult;

  return {
    id,
    ...rest,
    date: JSON.stringify(date),
  };
}

export function getSorterIEO() {
  const fileNames = fs.readdirSync(ieoDir);
  const orderItems = fileNames.map((fileName) => {
    const fullPath = path.join(ieoDir, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContent);
    const {
      data: { date, ...rest },
    } = matterResult;

    return { ...rest, date: JSON.stringify(date) };
  });

  return orderItems.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
