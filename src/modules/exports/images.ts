type ImageModules = Record<string, string>;

const importImages = (context: __WebpackModuleApi.RequireContext): ImageModules => {
  return context.keys().reduce((images, path) => {
    const key = path
      .replace(/^\.\//, "") // Убираем ./ в начале пути
      .replace(/\.(png|jpe?g|gif|svg)$/, ""); // Убираем расширение файла
    images[key] = context(path).default || context(path);
    return images;
  }, {} as ImageModules);
};

// Импорт изображений из папки assets/img
const imgContext = require.context("../../assets/img", false, /\.(png|jpe?g|gif)$/);
const imgImages = importImages(imgContext);

// Импорт изображений из папки assets/svg
const svgContext = require.context("../../assets/svg", false, /\.svg$/);
const svgImages = importImages(svgContext);

// Объединяем изображения в один объект
export const images: ImageModules = { ...imgImages, ...svgImages };