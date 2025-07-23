type ImageModules = Record<string, string>;

const importImages = (context: __WebpackModuleApi.RequireContext): ImageModules => {
  return context.keys().reduce((images, path) => {
    const key = path
      .replace(/^\.\//, "")
      .replace(/\.(png|jpe?g|gif|svg)$/, "");
    images[key] = context(path).default || context(path);
    return images;
  }, {} as ImageModules);
};

const imgContext = require.context("../../assets/img", false, /\.(png|jpe?g|gif)$/);
const imgImages = importImages(imgContext);

const svgContext = require.context("../../assets/svg", false, /\.svg$/);
const svgImages = importImages(svgContext);

export const images: ImageModules = { ...imgImages, ...svgImages };