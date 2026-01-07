import axios from "axios";

export async function runCheck(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data;
    const linkCount = (html.match(/<a /g) || []).length;

    return {
      statusCode: response.status,
      htmlSize: html.length,
      linkCount,
      checkedAt: new Date(),
    };
  } catch (err) {
    return {
      statusCode: err.response?.status || 500,
      htmlSize: 0,
      linkCount: 0,
      checkedAt: new Date(),
    };
  }
}
