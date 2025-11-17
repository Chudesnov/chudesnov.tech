module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/theme.css");
    eleventyConfig.addPassthroughCopy("src/snow.js");
    eleventyConfig.addPassthroughCopy("src/snow-worker.js");
    eleventyConfig.addPassthroughCopy("src/season.js");
    return {
        dir: {
            input: "src",
            output: "dist"
        }
    }
}