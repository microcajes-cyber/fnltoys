import { loadCatalogFile, loadPublishedCatalog } from '../src/lib/catalog/load-published-catalog';

const file = loadCatalogFile();
const published = loadPublishedCatalog();
const options = file.products.reduce((sum, product) => sum + product.options.length, 0);
const publishedOptions = published.products.reduce(
  (sum, product) => sum + product.options.length,
  0
);

console.info(`contract v${file.contractVersion}`);
console.info(`exported products: ${file.products.length}`);
console.info(`exported options: ${options}`);
console.info(`published products: ${published.products.length}`);
console.info(`published options: ${publishedOptions}`);
