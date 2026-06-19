module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/theme.css");
  eleventyConfig.addPassthroughCopy("src/style.css");
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

  eleventyConfig.addCollection("writing", (api) =>
    api.getFilteredByTag("writing").sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};