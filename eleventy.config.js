import rssPlugin from "@11ty/eleventy-plugin-rss";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/snow.js");
  eleventyConfig.addPassthroughCopy("src/snow-worker.js");
  eleventyConfig.addPassthroughCopy("src/season.js");

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!(dateObj instanceof Date)) return String(dateObj);
    return dateObj.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!(dateObj instanceof Date)) return String(dateObj);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  // Filters for the Atom feed (src/feed.njk): absoluteUrl, dateToRfc3339, htmlToAbsoluteUrls.
  eleventyConfig.addPlugin(rssPlugin);

  // Last change to a post: `updated` front matter (written by the CMS) or its publish date.
  const updatedDate = (post) => {
    const updated = post.data.updated instanceof Date ? post.data.updated : null;
    return updated && updated > post.date ? updated : post.date;
  };
  eleventyConfig.addFilter("updatedDate", updatedDate);
  eleventyConfig.addFilter("latestUpdate", (posts) =>
    posts.length ? new Date(Math.max(...posts.map(updatedDate))) : new Date()
  );

  eleventyConfig.addCollection("writing", (api) =>
    api.getFilteredByGlob("src/writing/*.md").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}